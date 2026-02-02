import { Notification } from "../models/Notification";

export interface CreateNotificationData {
    userId: string;
    type: "activity" | "message" | "alert" | "system";
    title: string;
    message: string;
    relatedId?: string;
    relatedType?: "project" | "consultant" | "bid" | "team";
    severity?: "Low" | "Medium" | "High";
}

/**
 * Create a new notification
 */
export async function createNotification(data: CreateNotificationData) {
    const notification = await Notification.create({
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        relatedId: data.relatedId,
        relatedType: data.relatedType,
        severity: data.severity || "Low",
        isRead: false
    });

    return notification;
}

/**
 * Get activity notifications for a user
 */
export async function getActivities(userId: string, limit = 20) {
    const notifications = await Notification.find({
        userId,
        type: "activity"
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return notifications;
}

/**
 * Get message notifications for a user
 */
export async function getMessages(userId: string, limit = 20) {
    const notifications = await Notification.find({
        userId,
        type: "message"
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return notifications;
}

/**
 * Get alert notifications for a user
 */
export async function getAlerts(userId: string, limit = 20) {
    const notifications = await Notification.find({
        userId,
        type: "alert"
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return notifications;
}

/**
 * Get all notifications for a user
 */
export async function getAllNotifications(userId: string, limit = 50) {
    const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return notifications;
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string) {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
    await Notification.findByIdAndDelete(notificationId);
}
