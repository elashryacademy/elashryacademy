import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function hasPermission() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN" || session?.user?.role === "ASSISTANT";
}

export async function GET() {
  if (!(await hasPermission())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        user: { select: { name: true, username: true } },
        course: { select: { title: true } }
      },
      orderBy: { issueDate: "desc" }
    });
    return NextResponse.json(certificates);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await hasPermission())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { userId, courseId } = await req.json();
    
    // Check if course allows certificates
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course?.hasCertificate) {
        return NextResponse.json({ error: "This course does not issue certificates" }, { status: 400 });
    }

    // Check if already issued
    const existing = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });

    if (existing) {
      return NextResponse.json({ error: "Certificate already issued" }, { status: 400 });
    }

    const serialNumber = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        serialNumber,
      }
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error("Issue certificate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
