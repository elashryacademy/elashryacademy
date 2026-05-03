import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function hasPermission(courseId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.role === "ADMIN") return true;
  
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return false;

  if (session.user.role === "ASSISTANT") return true;
  if (session.user.role === "TEACHER" && course.instructorId === session.user.id) return true;

  return false;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await hasPermission(params.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, price, thumbnail, level, grade, hasCertificate, certificateTemplate, published, categoryId } = body;

    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        title,
        description,
        price: typeof price === 'string' ? parseFloat(price) : price,
        thumbnail,
        level,
        grade,
        categoryId,
        hasCertificate,
        certificateTemplate,
        published,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Course update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
