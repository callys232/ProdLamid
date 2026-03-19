import { useState, useEffect } from "react";

export function useNotifications() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let mounted = true;

        const fetchNotifications = async () => {
            try {
                const res = await fetch("/api/notifications");
                const data = await res.json();
                if (mounted) {
                    setCount(data.notifications.length);
                }
            } catch { }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    return count;
}