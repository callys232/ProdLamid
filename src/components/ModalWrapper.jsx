// src/components/ModalWrapper.jsx
"use client";

import { useState, useEffect } from "react";
import BizSphereModal from "@/components/BizSphereModal";

export default function ModalWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  // Function to check if user has scrolled to the bottom
  const handleScroll = () => {
    if (hasShownModal) return; // Don't show modal again if already shown once
    
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Check if user has scrolled to the bottom (with a small threshold)
    const bottomThreshold = 100; // px from bottom
    if (scrollPosition + windowHeight >= documentHeight - bottomThreshold) {
      setIsModalOpen(true);
      setHasShownModal(true); // Prevent showing the modal multiple times
    }
  };

  useEffect(() => {
    // Check if we've already shown the modal in this session
    const hasShown = localStorage.getItem("hasShownBizSphereModal");
    if (hasShown) {
      setHasShownModal(true);
    }
    
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasShownModal]);

  // Save modal state to localStorage when it changes
  useEffect(() => {
    if (hasShownModal) {
      localStorage.setItem("hasShownBizSphereModal", "true");
    }
  }, [hasShownModal]);

  return <BizSphereModal isOpen={isModalOpen} onClose={closeModal} />;
}