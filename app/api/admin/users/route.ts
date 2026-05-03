import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

export async function POST(req: Request) {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { name, email, username, password, role, phone } = await req.json();

        if (!name || !username || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    email ? { email } : {},
                    phone ? { phone } : {}
                ].filter(condition => Object.keys(condition).length > 0)
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User with this username, email or phone already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword,
                role,
                phone,
                isVerified: true
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Admin user creation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("id");
  
      if (!userId) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
      }

      // لا تسمح للمدير بحذف نفسه
      const session = await getServerSession(authOptions);
      if (userId === session?.user?.id || userId === "admin-id") {
          return NextResponse.json({ error: "Cannot delete yourself or core admin" }, { status: 400 });
      }
  
      await prisma.user.delete({
        where: { id: userId },
      });
  
      return NextResponse.json({ message: "User deleted" });
    } catch (error) {
      console.error("Admin user deletion error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

export async function PATCH(req: Request) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { userId, role } = await req.json();

        if (!userId || !role) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Admin user update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
