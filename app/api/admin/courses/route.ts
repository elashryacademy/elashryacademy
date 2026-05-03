import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// وظيفة للتحقق من أن المستخدم مدير
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

async function hasPermission() {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.role === "ADMIN") return true;
  
  if (session.user.role === "TEACHER" || session.user.role === "ASSISTANT") {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    return user?.canUpload || session.user.role === "ASSISTANT";
  }
  return false;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!(await hasPermission())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { title, description, price, thumbnail, level, grade, hasCertificate, certificateTemplate, categoryId } = await req.json();

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price) || 0,
        thumbnail,
        level,
        grade,
        categoryId,
        hasCertificate: hasCertificate || false,
        certificateTemplate,
        instructorId: session!.user.id,
        published: true,
        isApproved: session?.user.role === "ADMIN" || session?.user.role === "ASSISTANT", 
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Course creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  
    try {
      const { searchParams } = new URL(req.url);
      const courseId = searchParams.get("id");
  
      if (!courseId) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
      }
  
      await prisma.course.delete({
        where: { id: courseId },
      });
  
      return NextResponse.json({ message: "Course deleted" });
    } catch (error) {
      console.error("Admin course deletion error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
