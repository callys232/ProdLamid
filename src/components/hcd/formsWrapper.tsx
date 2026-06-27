"use client";

import React from "react";
import Modal from "./Modal";
import TrainingForm from "@/forms/training";
import RecruitmentForm from "@/forms/recruitment";
import TalentClub from "@/forms/talentClub";
import { User } from "@/types/user";

interface FormsWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  formType: "training" | "recruitment" | "talent" | null;
  user: User | null;
}

const FormsWrapper: React.FC<FormsWrapperProps> = ({
  isOpen,
  onClose,
  formType,
  user,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {formType === "training" && (
        <TrainingForm closeModal={onClose} user={user} />
      )}
      {formType === "recruitment" && (
        <RecruitmentForm closeModal={onClose} user={user} />
      )}
      {formType === "talent" && <TalentClub closeModal={onClose} user={user} />}
    </Modal>
  );
};

export default FormsWrapper;
