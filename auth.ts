import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Line from "next-auth/providers/line";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Line({
            clientId: process.env.LINE_CLIENT_ID,
            clientSecret: process.env.LINE_CLIENT_SECRET,
            checks: ["state"], // LINE usually requires state check or disables PKCE if not supported, but v5 defaults are usually good. 'state' is safe.
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: { strategy: "jwt" },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminPage = nextUrl.pathname.startsWith("/admin");
            // @ts-ignore
            const role = auth?.user?.role;
            const isAdmin = role === "ADMIN";

            if (isAdminPage) {
                if (isLoggedIn && isAdmin) return true;
                return false;
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
            } else if (!token.role && token.email) {
                // If role is missing for some reason, fetch it
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                    select: { id: true, role: true }
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-ignore
                session.user.id = token.id;
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
    },
});
