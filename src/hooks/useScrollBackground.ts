"use client";
import { useEffect } from "react";

export function useScrollBackground() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-section]")
    );
    if (!sections.length) return;

    document.body.classList.add("scroll-bg-active");

    const isDark = () => document.documentElement.classList.contains("dark");

    const applyBg = (el: HTMLElement) => {
      const from = isDark()
        ? el.dataset.bgFromDark  || el.dataset.bgFromLight || ""
        : el.dataset.bgFromLight || el.dataset.bgFromDark  || "";
      const to = isDark()
        ? el.dataset.bgToDark    || el.dataset.bgToLight   || ""
        : el.dataset.bgToLight   || el.dataset.bgToDark    || "";

      const root = document.documentElement;
      if (from) root.style.setProperty("--scroll-bg-from", from);
      if (to)   root.style.setProperty("--scroll-bg-to",   to);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (hit.length) applyBg(hit[0].target as HTMLElement);
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    applyBg(sections[0]);

    const modeObserver = new MutationObserver(() => {
      const visible = sections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top < window.innerHeight * 0.65 && r.bottom > window.innerHeight * 0.35;
      });
      if (visible) applyBg(visible);
    });
    modeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      modeObserver.disconnect();
      document.body.classList.remove("scroll-bg-active");
      document.documentElement.style.removeProperty("--scroll-bg-from");
      document.documentElement.style.removeProperty("--scroll-bg-to");
    };
  }, []);
}
