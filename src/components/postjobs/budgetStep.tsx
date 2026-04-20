"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Project } from "@/types/project";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BudgetEstimatorGate from "./aiBugetEstimator";
import BudgetEstimator from "../BugdetEstimator/estimator";
import { Modal } from "./estimateModal";
import BudgetPreviewVideo from "./peekview";

interface BudgetStepProps {
  project: Project;
  handleChange: (field: keyof Project, value: string | number | null) => void;
  errors: Record<string, string>;
  currencyOptions?: string[];
  premiumUser?: boolean;
}

export default function BudgetStep({
  project,
  handleChange,
  errors,
  currencyOptions = ["$", "€", "£", "₦"],
  premiumUser = true,
}: BudgetStepProps) {

  const [budgetType, setBudgetType] = useState<"fixed" | "hourly">(
    project.hourlyRate ? "hourly" : "fixed"
  );

  const [sliderValue, setSliderValue] = useState<number>(project.budget ?? 0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEstimation, setAiEstimation] = useState<{
    budgetMin: number;
    budgetMax: number;
    durationMonths: number;
    explanation: string;
  } | null>(null);

  const sliderMin = 0;
  const sliderMax = 200000;

  const currency = project.currency ?? currencyOptions[0];

  const safeNumber = (val: unknown, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const n = Number(val);
    if (Number.isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  };

  const formatCurrency = (value: number | null | undefined) => {
    return `${currency}${(value ?? 0).toLocaleString()}`;
  };

  const formatDate = (date?: Date | null) => {
    if (!date || isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const presets = useMemo(
    () => [
      { label: "Starter", value: 500 },
      { label: "Small", value: 2500 },
      { label: "Medium", value: 10000 },
      { label: "Large", value: 50000 },
      { label: "Enterprise", value: 150000 },
    ],
    []
  );
  const router = useRouter();
  const goToPremium = () => {
    router.push("/premium");
  };
  const estimatedCost = useMemo(() => {
    if (budgetType === "fixed") return sliderValue;
    if (project.hourlyRate && project.hourlyRate > 0) {
      return Number((project.hourlyRate * 160).toFixed(2));
    }
    return 0;
  }, [project.hourlyRate, sliderValue, budgetType]);

  useEffect(() => {
    setSliderValue(project.budget ?? 0);
  }, [project.budget]);

  useEffect(() => {
    if (!premiumUser || !project.title || !project.category) return;

    const fetchEstimation = async () => {
      setAiLoading(true);
      try {
        const response = await fetch("/api/projects/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: project.title,
            category: project.category,
            description: project.description,
            skills: project.skills,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setAiEstimation(data);
        }
      } catch (error) {
        console.error("Error fetching AI estimation:", error);
      } finally {
        setAiLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchEstimation, 1000);
    return () => clearTimeout(debounceTimer);
  }, [project.title, project.category, project.description, project.skills, premiumUser]);

  const onSliderChange = (v: number) => {
    const safe = safeNumber(v, sliderMin, sliderMax);
    setSliderValue(safe);
    handleChange("budget", safe);
  };

  const onPresetClick = (v: number) => {
    setSliderValue(v);
    handleChange("budget", v);
  };

  const onHourlyChange = (val: string) => {
    const safe = val ? safeNumber(val, 0, 100000) : null;
    handleChange("hourlyRate", safe);
  };

  const onBudgetTypeChange = (type: "fixed" | "hourly") => {
    setBudgetType(type);
    if (type === "fixed") handleChange("hourlyRate", null);
    else handleChange("budget", 0);
  };



  const [showEstimatorModal, setShowEstimatorModal] = useState(false);

  const openEstimator = () => {
    setShowEstimatorModal(true);
  };


  /* ================= DATE VALIDATION ================= */

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const addMonths = (date: Date, months: number) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const startDate = project.startDate ? new Date(project.startDate) : null;
  const endDate = project.endDate ? new Date(project.endDate) : null;
  const deadline = project.deadline ? new Date(project.deadline) : null;

  const minStart = today;

  const minEnd = startDate ? addMonths(startDate, 3) : null;

  const minDeadline = startDate ? addMonths(startDate, 3) : null;

  const startDateError =
    startDate && startDate < today
      ? "Start date cannot be in the past."
      : null;

  const endDateError =
    startDate && endDate && minEnd && endDate.getTime() < minEnd.getTime()
      ? "End date must be at least 3 months after start date."
      : null;

  const deadlineError =
    startDate && deadline && minDeadline && deadline.getTime() < minDeadline.getTime()
      ? "Deadline must be at least 3 months after start date."
      : null;
  /* ================= TIMELINE PROGRESS ================= */

  const timelinePercent = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const total = endDate.getTime() - startDate.getTime();
    const now = Date.now() - startDate.getTime();
    return Math.min(100, Math.max(0, (now / total) * 100));
  }, [startDate, endDate]);

  /* ================= AI TIMELINE ESTIMATION ================= */

  const timelineSuggestion = useMemo(() => {
    if (!premiumUser) return null;

    const category = project.category?.toLowerCase() ?? "";

    if (category.includes("design"))
      return { months: 3, label: "Design projects usually run ~3 months." };

    if (category.includes("development"))
      return { months: 6, label: "Development projects average ~6 months." };

    return { months: 4, label: "Typical project duration ~4 months." };

  }, [project.category, premiumUser]);

  const autoEndDate = useMemo(() => {
    if (!premiumUser || !startDate) return null;

    const months = aiEstimation?.durationMonths ?? 4;
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + months);

    return d;
  }, [premiumUser, startDate, aiEstimation]);

  /* ================= AI BUDGET ADVISOR ================= */

  const aiBudgetSuggestion = useMemo(() => {
    if (!premiumUser) return null;

    const category = project.category ?? "";

    if (category.toLowerCase().includes("design"))
      return `${currency}2,000 – ${currency}10,000`;

    if (category.toLowerCase().includes("development"))
      return `${currency}5,000 – ${currency}25,000`;

    return `${currency}3,000 – ${currency}15,000`;

  }, [project.category, currency, premiumUser]);

  /* ================= TASK TYPES ================= */

  const taskTypes = [
    "Single Task",
    "Shared Task",
    "Co-operative Task",
    "Concurrent Task",
  ];

  return (
    <div className="space-y-6 text-black hover:text-[#c21219]">

      {/* ================= BUDGET TYPE ================= */}
      <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:text-[#c21219]  hover:shadow-lg transition">

        <label
          onClick={openEstimator}
          className="cursor-pointer underline"

        >
          Want an estimator? Click here
        </label>
        <div className="flex gap-2 ml-auto">

          <button
            type="button"
            onClick={() => onBudgetTypeChange("fixed")}
            className={`px-3 py-1 rounded-md text-sm border transition ${budgetType === "fixed"
              ? "bg-[#c21219] text-white border-[#c21219]"
              : "border-gray-200"
              }`}
          >
            Fixed
          </button>

          <button
            type="button"
            onClick={() => onBudgetTypeChange("hourly")}
            className={`px-3 py-1 rounded-md text-sm border transition ${budgetType === "hourly"
              ? "bg-[#c21219] text-white border-[#c21219]"
              : "border-gray-200"
              }`}
          >
            Hourly
          </button>

        </div>

      </div>

      {/* ================= FIXED BUDGET ================= */}

      {
        budgetType === "fixed" && (
          <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:text-[#c21219] hover:shadow-lg transition">

            <label className="block text-sm font-medium hover:text-[#c21219] text-gray-700">
              Project Budget
            </label>

            <div className="flex gap-3 mt-2">

              <input
                type="number"
                min={0}
                value={sliderValue}
                onChange={(e) => onSliderChange(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-md border ${errors.budget ? "border-red-500" : "border-gray-200"
                  } focus:ring-2 focus:ring-[#c21219]`}
              />

              <div className="text-sm text-gray-500 whitespace-nowrap">
                {formatCurrency(sliderValue)}
              </div>

            </div>

            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={50}
              value={sliderValue}
              onChange={(e) => onSliderChange(Number(e.target.value))}
              className="w-full mt-4 accent-[#c21219]"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatCurrency(sliderMin)}</span>
              <span>{formatCurrency(sliderMax)}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onPresetClick(p.value)}
                  className="px-3 py-1 text-xs rounded-md bg-gray-50 border border-gray-200 hover:bg-red-50 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>

          </div>
        )
      }

      {/* ================= HOURLY ================= */}

      {
        budgetType === "hourly" && (
          <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:shadow-lg transition">

            <label className="block text-sm font-medium hover:text-[#c21219] text-gray-700">
              Hourly Rate
            </label>

            <input
              type="number"
              min={0}
              step={0.01}
              value={project.hourlyRate ?? ""}
              onChange={(e) => onHourlyChange(e.target.value)}
              className="mt-2 w-full px-3 py-2 border rounded-md border-gray-200 focus:ring-2 focus:ring-[#c21219]"
            />

          </div>
        )
      }

      {/* ================= ESTIMATE ================= */}

      <div className="bg-gray-50 rounded-lg p-4 border  hover:text-[#c21219] text-sm text-gray-700">

        Estimated monthly cost:

        <span className="font-semibold ml-2">
          {formatCurrency(estimatedCost)}
        </span>

      </div>

      {/* ================= TIMELINE ================= */}

      <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:shadow-lg transition">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>

            <input
              type="date"
              min={formatDate(minStart)}
              value={project.startDate ?? ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="mt-2 w-full px-3 py-2 border rounded-md border-gray-200"
            />

            {startDateError && (
              <p className="text-xs text-red-500 mt-1">{startDateError}</p>
            )}

          </div>

          <div>
            <label className="block text-sm font-medium hover:text-[#c21219] text-gray-700">
              End Date
            </label>

            <input
              type="date"
              min={minEnd ? formatDate(minEnd) : undefined}
              value={project.endDate ?? ""}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="mt-2 w-full px-3 py-2 border rounded-md border-gray-200"
            />

            {endDateError && (
              <p className="text-xs text-red-500 mt-1">{endDateError}</p>
            )}

          </div>

        </div>

        <div className="mt-3">

          <label className="block text-sm font-medium hover:text-[#c21219] text-gray-700">
            Deadline
          </label>

          <input
            type="date"
            min={minDeadline ? formatDate(minDeadline) : undefined}
            value={project.deadline ?? ""}
            onChange={(e) => handleChange("deadline", e.target.value)}
            className="mt-2 w-full px-3 py-2 border rounded-md border-gray-200"
          />

          {deadlineError && (
            <p className="text-xs text-red-500 mt-1">{deadlineError}</p>
          )}

        </div>

        {startDate && endDate && (

          <div className="mt-4">

            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{project.startDate}</span>
              <span>{project.endDate}</span>
            </div>

            <div className="relative h-2 bg-gray-200 rounded-full">

              <div
                className="absolute top-0 left-0 h-2 bg-[#c21219] rounded-full"
                style={{ width: `${timelinePercent}%` }}
              />

            </div>

          </div>

        )}

      </div>

      {/* ================= TASK TYPE ================= */}

      <div className="bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:shadow-lg transition">

        <label className="block text-sm font-medium hover:text-[#c21219] text-gray-700 mb-3">
          Task Type
        </label>

        <div className="flex flex-wrap gap-3">

          {taskTypes.map((type) => {

            const selected = project.TaskType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => handleChange("TaskType", type)}
                className={`px-3 py-2 rounded-md border transition ${selected
                  ? "bg-[#c21219] text-white border-[#c21219]"
                  : "border-gray-200"
                  }`}
              >
                {type}
              </button>
            );
          })}

        </div>

      </div>

      {/* ================= AI SUITE ================= */}

      <button
        onClick={() =>
          premiumUser ? router.push("/ai-agent") : router.push("/premium")
        }
        className="block w-full text-left bg-white rounded-lg p-4 ring-1 ring-gray-100 hover:shadow-xl hover:-translate-y-[2px] transition"
      >

        <div className="flex items-center justify-between">

          <div>
            <h4 className="text-sm font-semibold text-gray-800">
              AI Project Intelligence Suite
            </h4>

            <p className="text-xs text-gray-500">
              Budget advisor • Timeline estimator • Milestone alignment
            </p>
          </div>

          {!premiumUser && (
            <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Premium
            </div>
          )}

        </div>

        {premiumUser ? (
          <div className="space-y-3 mt-3">
            {aiLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                Analyzing project details...
              </div>
            ) : (
              <>
                {aiEstimation ? (
                  <>
                    <div className="text-sm text-gray-700">
                      Suggested budget range:
                      <span className="font-semibold ml-1">
                        {currency}{aiEstimation.budgetMin.toLocaleString()} – {currency}{aiEstimation.budgetMax.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-sm text-gray-700">
                      Typical project duration ~{aiEstimation.durationMonths} months.
                    </div>

                    {aiEstimation.explanation && (
                      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100 italic">
                        " {aiEstimation.explanation} "
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-gray-500 italic">
                    Fill in project title and category to get AI insights.
                  </div>
                )}

                {autoEndDate && (
                  <div className="text-xs text-gray-500">
                    Suggested end date:
                    <span className="font-semibold ml-1">
                      {formatDate(autoEndDate)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="mt-3 text-xs text-gray-500">
            Upgrade to Premium to unlock AI planning tools.
          </div>
        )}

      </button>
      {/* ================= ESTIMATOR MODAL ================= */}
      <Modal
        open={showEstimatorModal}
        onClose={() => setShowEstimatorModal(false)}
        title="AI Budget Estimator"
      >
        {/* Mobile-safe scroll container */}
        <div className="max-h-[85vh] overflow-y-auto px-3 sm:px-5 pb-6">

          <BudgetEstimatorGate
            premiumUser={premiumUser}
            project={project}
            onUpgrade={goToPremium}
            mode="modal"
          />

        </div>
      </Modal>
    </div >
  );
}