// components/ReviewPopupContainer.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ReviewPopup from "./reviewPop";
import {
  UserAlert,
  mockAlerts,
  mockNotifications,
  mockPayments,
  mockDeadlines,
} from "@/mocks/useralert";

interface ReviewPopupContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewPopupContainer({
  isOpen,
  onClose,
}: ReviewPopupContainerProps) {
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [notifications, setNotifications] = useState<UserAlert[]>([]);
  const [payments, setPayments] = useState<UserAlert[]>([]);
  const [deadlines, setDeadlines] = useState<UserAlert[]>([]);
  const [reviews, setReviews] = useState<UserAlert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/user/alerts");
        const data = res.data || {};
        setAlerts(data.alerts || []);
        setNotifications(data.notifications || []);
        setPayments(data.payments || []);
        setDeadlines(data.deadlines || []);
        setReviews(data.reviews || []);
        setError(null);
      } catch {
        setError("Unable to fetch live data. Showing fallback.");
        setAlerts(mockAlerts);
        setNotifications(mockNotifications);
        setPayments(mockPayments);
        setDeadlines(mockDeadlines);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  return (
    <ReviewPopup
      isOpen={isOpen}
      onClose={onClose}
      alerts={alerts}
      notifications={notifications}
      payments={payments}
      deadlines={deadlines}
      reviews={reviews}
      loading={loading}
      error={error}
    />
  );
}
