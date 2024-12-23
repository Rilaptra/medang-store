import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { User } from "@/lib/db/models/user.model";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/db/connect";

export const authOptions = {
  secret: "secret",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await compare(credentials.password, user.hash);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Ensure user has a role property before assigning
        if (typeof user === "object") {
          if ("role" in user && typeof user.role === "string") {
            token.role = user.role;
          }
          if ("id" in user && typeof user.id === "string") {
            token.id = user.id;
          }
          if ("username" in user && typeof user.username === "string") {
            token.username = user.username;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user = {
          ...session.user,
          role: token.role as "admin" | "member" | "seller",
          id: token.id as string,
          username: token.username as string,
        };
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      return url;
    },
  },
} as AuthOptions;
