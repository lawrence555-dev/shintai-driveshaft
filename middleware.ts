export { auth as middleware } from "./auth";

// Define matched routes for the middleware
export const config = {
    matcher: ["/admin/:path*", "/booking/:path*"],
};
