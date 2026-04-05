"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { consultantProfileSchema } from "@/lib/validation/consultantProfileSchema";

import StepBasicInfo from "./editProfile/basicInfo";
import StepProfessional from "./editProfile/professionalInfo";
import StepSocials from "./editProfile/socials";
import StepStatus from "./editProfile/availibilty";
import StepReview from "./editProfile/review";
import { MultiStepFormValues } from "@/types/userProfile";

/* ================= TYPES ================= */

/* ================= ONCHANGE TYPE ================= */

type OnChange = (
  field: any,
  value: any
) => void;

/* ================= COMPONENT ================= */

interface Props {
  initialData?: Partial<MultiStepFormValues>;
  user?: any;
  onClose: () => void;
}

export default function MultiStepForm({
  initialData = {},
  user,
  onClose,
}: Props) {
  /* ---------------- STEPS ---------------- */

  const steps = [
    {
      label: "Basic Info",
      component: StepBasicInfo,
      fields: ["firstName", "lastName", "bio", "location", "title"],
    },
    {
      label: "Professional Info",
      component: StepProfessional,
      fields: ["skills", "industry", "experience", "rate"],
    },
    {
      label: "Social Media",
      component: StepSocials,
      fields: ["socialLinks"],
    },
    {
      label: "Verification",
      component: StepStatus,
      fields: ["premium", "verified", "businessEnrolled"],
    },
    {
      label: "Review",
      component: StepReview,
      fields: [],
    },
  ] as const;

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const CurrentStep = steps[step].component;

  /* ---------------- FORM ---------------- */

  const methods = useForm<MultiStepFormValues>({
    resolver: zodResolver(consultantProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      location: "",
      title: "",
      photo: null,

      skills: [],
      industry: "",
      experience: 0,
      rate: 0,

      socialLinks: {},

      premium: false,
      verified: false,
      businessEnrolled: false,

      ...user,
      ...initialData,
    },
    mode: "onChange",
  });

  /* ---------------- CHANGE HANDLER ---------------- */

  const handleChange: OnChange = (field, value) => {
    methods.setValue(field as any, value as any, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /* ---------------- RESTORE DRAFT ---------------- */

  useEffect(() => {
    const saved = localStorage.getItem("consultantProfileDraft");

    if (saved) {
      try {
        methods.reset(JSON.parse(saved));
      } catch {
        // silently ignore bad data
      }
    }
  }, [methods]);

  /* ---------------- AUTO SAVE ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      const data = methods.getValues();

      localStorage.setItem(
        "consultantProfileDraft",
        JSON.stringify(data)
      );
    }, 30000);

    return () => clearInterval(interval);
  }, [methods]);

  /* ---------------- NAVIGATION ---------------- */

  const handleNext = async () => {
    const fields = steps[step].fields as unknown as FieldPath<MultiStepFormValues>[];

    // Validate ONLY current step fields
    const valid = await methods.trigger(fields);

    if (!valid) {
      toast.error("Fix errors before continuing");
      return;
    }

    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleJumpToStep = (index: number) => {
    setStep(index);
  };

  const handleSaveDraft = () => {
    const data = methods.getValues();

    localStorage.setItem(
      "consultantProfileDraft",
      JSON.stringify(data)
    );

    toast.success("Draft saved");
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (data: MultiStepFormValues) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      localStorage.removeItem("consultantProfileDraft");

      toast.success("Profile updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PROGRESS ---------------- */

  const progress = ((step + 1) / steps.length) * 100;

  /* ---------------- RENDER ---------------- */

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="max-w-3xl mx-auto bg-black/80 p-6 rounded-xl shadow-xl space-y-6"
      >
        {/* PROGRESS */}
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c12129] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-white">
          {steps[step].label}
        </h2>

        {/* STEP */}
        <CurrentStep
          data={methods.getValues()}
          onChange={handleChange}
          onJumpToStep={handleJumpToStep}
        />

        {/* ACTIONS */}
        <div className="flex justify-between gap-2 flex-wrap">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
            >
              Back
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md transition"
          >
            Save Draft
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-[#c12129] hover:bg-red-700 rounded-md transition shadow"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}