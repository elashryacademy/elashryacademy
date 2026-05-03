import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  await prisma.user.update({
    where: { id: params.id },
    data: { 
      canUpload: body.canUpload,
      canManageCourses: body.canManageCourses,
      canManageUsers: body.canManageUsers,
      canManageSupport: body.canManageSupport,
      canManageCertificates: body.canManageCertificates,
      canManageSettings: body.canManageSettings,
      canViewStats: body.canViewStats
    }
  });

  return new NextResponse("Updated", { status: 200 });
}
