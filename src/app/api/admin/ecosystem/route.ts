import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/middleware/auth";
import { ToolUsage } from "@/lib/models/ToolUsage";
import { MODULE_REGISTRY } from "@/lib/intelligence/moduleRegistry";
import { MODULE_ROUTES } from "@/lib/intelligence/moduleRoutes";
import { ROSTER_MODULES, SCENARIO_MODULES } from "@/lib/intelligence/inputSpec";

export const dynamic = "force-dynamic";

/**
 * Ecosystem administration.
 *
 * Every engine run already writes a ToolUsage row; until now nothing read them
 * back. This joins that usage against the registry so an administrator can see
 * which engines earn their place, which have never been opened, and where the
 * registry itself has drifted out of step with the routes.
 */

/** An engine computes its numbers in TypeScript rather than asking the model. */
function isComputeBacked(id: string): boolean {
  const cfg = MODULE_REGISTRY[id];
  if (cfg?.inputs) return true;
  const prefix = id[0];
  return prefix === "R" || prefix === "P" || prefix === "F"
    || ROSTER_MODULES.has(id) || SCENARIO_MODULES.has(id);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    if (auth.userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get("days")) || 30, 1), 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60_000);

    /* ── Usage, grouped per engine ── */
    const [byModule, windowed, totals] = await Promise.all([
      ToolUsage.aggregate([
        { $group: {
            _id:       "$moduleId",
            runs:      { $sum: 1 },
            users:     { $addToSet: "$userId" },
            lastRun:   { $max: "$runAt" },
            engineName:{ $last: "$engineName" },
        } },
        { $project: {
            _id: 0, moduleId: "$_id", runs: 1, lastRun: 1, engineName: 1,
            uniqueUsers: { $size: "$users" },
        } },
        { $sort: { runs: -1 } },
      ]),
      ToolUsage.aggregate([
        { $match: { runAt: { $gte: since } } },
        { $group: { _id: "$moduleId", runs: { $sum: 1 } } },
      ]),
      ToolUsage.aggregate([
        { $group: { _id: null, runs: { $sum: 1 }, users: { $addToSet: "$userId" } } },
        { $project: { _id: 0, runs: 1, uniqueUsers: { $size: "$users" } } },
      ]),
    ]);

    const windowRuns = new Map<string, number>(windowed.map((w) => [w._id, w.runs]));
    const usageById  = new Map<string, (typeof byModule)[number]>(byModule.map((m) => [m.moduleId, m]));

    /* ── Registry side ── */
    const allModules = Object.values(MODULE_REGISTRY);
    const registryIds = allModules.map((m) => m.id);

    const engines = registryIds.map((id) => {
      const cfg = MODULE_REGISTRY[id];
      const u   = usageById.get(id);
      return {
        moduleId:     id,
        engineName:   cfg.engineName,
        series:       cfg.seriesName.split(" — ")[0],
        route:        MODULE_ROUTES[id] ?? null,
        computeBacked: isComputeBacked(id),
        runs:         u?.runs ?? 0,
        runsInWindow: windowRuns.get(id) ?? 0,
        uniqueUsers:  u?.uniqueUsers ?? 0,
        lastRun:      u?.lastRun ?? null,
      };
    });

    const used   = engines.filter((e) => e.runs > 0);
    const unused = engines.filter((e) => e.runs === 0);

    /* ── Per-series rollup ── */
    const seriesMap = new Map<string, { series: string; total: number; used: number; runs: number; computeBacked: number }>();
    for (const e of engines) {
      const row = seriesMap.get(e.series) ?? { series: e.series, total: 0, used: 0, runs: 0, computeBacked: 0 };
      row.total += 1;
      if (e.runs > 0) row.used += 1;
      if (e.computeBacked) row.computeBacked += 1;
      row.runs += e.runs;
      seriesMap.set(e.series, row);
    }

    /* ── Registry health — drift between registry, routes and input specs ── */
    const registrySet = new Set(registryIds);
    const missingRoute   = registryIds.filter((id) => !MODULE_ROUTES[id]);
    const orphanRoute    = Object.keys(MODULE_ROUTES).filter((id) => !registrySet.has(id));
    // IDs declared as typed inputs that no longer exist in the registry.
    const danglingSpecs  = [...ROSTER_MODULES, ...SCENARIO_MODULES].filter((id) => !registrySet.has(id));

    const computeBackedCount = engines.filter((e) => e.computeBacked).length;

    return NextResponse.json({
      windowDays: days,
      totals: {
        engines:        engines.length,
        computeBacked:  computeBackedCount,
        narrativeOnly:  engines.length - computeBackedCount,
        enginesUsed:    used.length,
        enginesUnused:  unused.length,
        totalRuns:      totals[0]?.runs ?? 0,
        uniqueUsers:    totals[0]?.uniqueUsers ?? 0,
        runsInWindow:   windowed.reduce((a, w) => a + w.runs, 0),
      },
      topEngines: [...used].sort((a, b) => b.runs - a.runs).slice(0, 15),
      // The culling list — compute-backed ones are listed first as the surprising cases.
      unusedEngines: unused
        .sort((a, b) => Number(b.computeBacked) - Number(a.computeBacked) || a.moduleId.localeCompare(b.moduleId))
        .slice(0, 60),
      series: [...seriesMap.values()].sort((a, b) => b.runs - a.runs),
      health: { missingRoute, orphanRoute, danglingSpecs },
    });
  } catch (e: unknown) {
    console.error("[Admin/Ecosystem]", e);
    return NextResponse.json({ error: "Could not load ecosystem data." }, { status: 500 });
  }
}
