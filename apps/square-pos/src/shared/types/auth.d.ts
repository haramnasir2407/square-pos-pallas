import NextAuth, { DefaultSession } from "next-auth";

// extending the existing types of the next-auth module to add custom fields to the Session object
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    merchantId?: string;
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
    };
  }
}
