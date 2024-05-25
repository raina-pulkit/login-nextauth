import prisma from "@/app/utils/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      // Authorize on initiates when we login (login functionality)
      async authorize(credentials, req): Promise<User | null> {
        try {
          // Login logic

          // if (!credentials) throw new Error("No credentials Provided");

          const body = {
            email: credentials?.email,
            password: credentials?.password,
          };

          const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          const user = await res.json();
          console.log("Res: ", res);
          console.log("User: ", user);
          
          
          if (res.status === 200 && user) return user;
          throw new Error(user.message);
        } catch (e: any) {
          throw new Error(e.message);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
