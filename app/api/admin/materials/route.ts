import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function hasPermission() {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  if (session.user.role === "ADMIN" || session.user.role === "ASSISTANT") return true;
  return false;
}

export async function GET() {
  if (!(await hasPermission())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const materials = await prisma.material.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(materials);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await hasPermission())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const material = await prisma.material.create({
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        price: parseFloat(body.price) || 0,
        type: body.type,
        format: body.format,
        level: body.level,
        grade: body.grade,
        fileUrl: body.fileUrl,
        isAvailable: body.isAvailable ?? true,
      },
    });
    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
