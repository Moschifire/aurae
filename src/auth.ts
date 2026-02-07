import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// 1. Tell TypeScript that our "User" and "Session" have a "role"
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if credentials exist
        if (!credentials?.email || !credentials?.password) return null;

        // Check against your .env.local variables
        const isAdminEmail = credentials.email === process.env.ADMIN_EMAIL;
        const isAdminPassword = credentials.password === process.env.ADMIN_PASSWORD;

        if (isAdminEmail && isAdminPassword) {
          // This object is returned and saved in the JWT
          return {
            id: "1",
            email: credentials.email as string,
            name: "Admin",
            role: "admin", // TypeScript now knows this is allowed
          };
        }

        return null; // Login failed
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Pass the role from the User object to the Token
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the role from the Token to the Session so the frontend can see it
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});