import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { userIds, title, message, channels } = await req.json();

        if (!userIds || !title || !message || !channels) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        let targetUsers: any[] = [];

        if (userIds === "all") {
            targetUsers = await prisma.user.findMany({
                select: { id: true, phone: true, email: true }
            });
        } else if (Array.isArray(userIds)) {
            targetUsers = await prisma.user.findMany({
                where: { id: { in: userIds } },
                select: { id: true, phone: true, email: true }
            });
        }

        const notificationPromises = targetUsers.map(user => 
            sendNotification({
                userId: user.id,
                userPhone: user.phone,
                userEmail: user.email,
                title,
                message,
                channels
            })
        );

        await Promise.all(notificationPromises);

        return NextResponse.json({ success: true, count: targetUsers.length });
    } catch (error) {
        console.error("[ADMIN_NOTIFICATIONS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
