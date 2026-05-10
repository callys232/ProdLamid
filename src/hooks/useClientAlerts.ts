"use client";

import { useState, useEffect } from "react";
import { UserAlert, mockAlerts, mockNotifications, mockPayments, mockDeadlines } from "@/mocks/useralert";

interface AlertsState {
  alerts:        UserAlert[];
  notifications: UserAlert[];
  payments:      UserAlert[];
  deadlines:     UserAlert[];
}

export function useClientAlerts() {
  const [state, setState] = useState<AlertsState>({
    alerts: [], notifications: [], payments: [], deadlines: [],
  });

  useEffect(() => {
    fetch("/api/client/alerts", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => setState({
        alerts:        data?.alerts        ?? mockAlerts,
        notifications: data?.notifications ?? mockNotifications,
        payments:      data?.payments      ?? mockPayments,
        deadlines:     data?.deadlines     ?? mockDeadlines,
      }))
      .catch(() => setState({
        alerts: mockAlerts, notifications: mockNotifications,
        payments: mockPayments, deadlines: mockDeadlines,
      }));
  }, []);

  const total =
    state.alerts.length +
    state.notifications.length +
    state.payments.length +
    state.deadlines.length;

  return { ...state, total };
}
