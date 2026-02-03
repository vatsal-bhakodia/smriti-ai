import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that REQUIRE authentication
// All other routes are public by default
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/folder(.*)",
  "/resource", // Exact match for /resource
  "/resource/(.*)", // Matches /resource/... but NOT /resources
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
