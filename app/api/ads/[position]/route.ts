import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { position: string } }
) {
  try {
    const ads = await prisma.advertisement.findMany({
      where: {
        position: params.position,
        isActive: true
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
