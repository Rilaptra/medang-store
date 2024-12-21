import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      name?: string;
      email?: string;
      image?: string;
      username?: string;
    };
  }
}
