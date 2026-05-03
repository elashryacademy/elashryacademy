import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { courses: true, materials: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { name } = await req.json();
        if (!name) return new NextResponse("Name is required", { status: 400 });

        const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

        const category = await prisma.category.create({
            data: { name, slug }
        });

        return NextResponse.json(category);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
