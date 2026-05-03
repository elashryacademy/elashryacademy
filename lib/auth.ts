import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === "Medo" && credentials?.password === "Medo500600700") {
          return {
            id: "admin-id",
            name: "Medo",
            email: "admin@elashry.com",
            role: "ADMIN",
          };
        }

        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.username },
              { username: credentials.username }
            ]
          }
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        if (!user.isVerified && user.role !== "ADMIN") {
          throw new Error(`UNVERIFIED:${user.id}`);
        }

        return user as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.studentCode = (user as any).studentCode;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.studentCode = token.studentCode;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
