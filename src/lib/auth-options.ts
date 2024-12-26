import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { AuthOptions, RequestInternal } from "next-auth";
import { IUser } from "./db/models/user.model";
export const authOptions = {
  secret: "secret",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "username",
        } as CredentialInput,
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        const url = `${req.headers!.origin}/api/login?username=${
          credentials.username
        }`;
        const data = await fetch(url);
        if (!data.ok) {
          throw new Error("Failed to fetch user data");
        }
        const { user } = (await data.json()) as { user: IUser };
        console.log(user);
        const isValid = await compare(credentials.password, user.hash);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id,
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
    error: "/auth/error",
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
