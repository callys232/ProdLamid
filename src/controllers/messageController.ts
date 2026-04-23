import { Message } from "@/lib/models/Message";
import connectDB from "@/lib/db";

export const sendMessage = async (projectId: string, senderId: string, data: any) => {
    await connectDB();
    const message = await Message.create({
        projectId,
        senderId,
        ...data,
        sentAt: new Date()
    });
    return message;
};

export const getMessages = async (projectId: string, unreadOnly: boolean = false, userId?: string) => {
    await connectDB();
    const query: any = { projectId };
    if (unreadOnly && userId) {
        query.readBy = { $ne: userId };
    }
    return await Message.find(query).sort({ sentAt: 1 }).populate("senderId", "username profileImage");
};

export const markAsRead = async (messageId: string, userId: string) => {
    await connectDB();
    return await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: userId } },
        { new: true }
    );
};
