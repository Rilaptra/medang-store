import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import connectDB from "@/lib/db/connect";
import * as db from "@/lib/db/models/user.model";

const handler = NextAuth({
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

        await connectDB();

        const user = await db.User.findOne({ email: credentials.email });

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
        console.log("user from jwt");
        console.log(user);
        // Ensure user has a role property before assigning
        if (
          typeof user === "object" &&
          "role" in user &&
          typeof user.role === "string"
        ) {
          token.role = user.role;
        }
        if (
          typeof user === "object" &&
          "id" in user &&
          typeof user.id === "string"
        ) {
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.role) {
        session.user = {
          ...session.user,
          role: token.role as string,
          id: token.id as string,
        };
      }
      console.log("session", session);

      return session;
    },
  },
});

export { handler as GET, handler as POST };
