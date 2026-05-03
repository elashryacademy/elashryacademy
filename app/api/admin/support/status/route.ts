import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPPORT")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { isOnline } = await req.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: { isOnline }
  });

  return NextResponse.json({ success: true });
}
