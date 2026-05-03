import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPPORT")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { content } = await req.json();

  const message = await prisma.supportMessage.create({
    data: {
      ticketId: params.id,
      senderId: session.user.id,
      content,
    },
    include: { sender: { select: { name: true } } }
  });

  // Update ticket agent if not assigned
  await prisma.supportTicket.update({
    where: { id: params.id },
    data: { agentId: session.user.id }
  });

  return NextResponse.json(message);
}
