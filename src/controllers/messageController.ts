import { Message } from "@/lib/models/Message";
import { Profile } from "@/lib/models/Profile";
import connectDB from "@/lib/db";

export const sendMessage = async (projectId: string, senderId: string, data: any) => {
    await connectDB();
    const message = await Message.create({
        projectId,
        senderId,
        ...data,
        sentAt: new Date(),
    });
    return message;
};

export const getMessages = async (projectId: string, unreadOnly: boolean = false, userId?: string) => {
    await connectDB();
    const query: any = { projectId };
    if (unreadOnly && userId) query.readBy = { $ne: userId };

    const messages = await Message
        .find(query)
        .sort({ sentAt: 1 })
        .populate("senderId", "username email")
        .lean();

    // Attach profile picture to each sender
    const senderIds = [...new Set(
        messages.map((m: any) => m.senderId?._id?.toString()).filter(Boolean)
    )];

    if (senderIds.length > 0) {
        const profiles = await Profile
            .find({ user: { $in: senderIds } })
            .select("user profilePicture")
            .lean() as any[];

        const picMap = Object.fromEntries(profiles.map(p => [p.user.toString(), p.profilePicture]));

        return messages.map((m: any) => ({
            ...m,
            senderId: m.senderId
                ? { ...m.senderId, profileImage: picMap[m.senderId._id?.toString()] ?? null }
                : m.senderId,
        }));
    }

    return messages;
};

export const markAsRead = async (messageId: string, userId: string) => {
    await connectDB();
    return await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: userId } },
        { new: true }
    );
};
