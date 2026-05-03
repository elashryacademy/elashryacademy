import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logAction, ACTIONS } from "@/lib/audit";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "ASSISTANT")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { isVerified } = await req.json();
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { isVerified }
    });

    // Log the action
    await logAction({
        userId: session.user.id,
        action: isVerified ? ACTIONS.VERIFY_USER : ACTIONS.DEACTIVATE_USER,
        targetId: params.id,
        details: `User ${user.name} (${user.email}) status changed to ${isVerified ? 'Verified' : 'Unverified'}`
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
