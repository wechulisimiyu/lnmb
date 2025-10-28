import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/manage(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const resolved = await auth();
    // `auth()` returns a runtime object that has `protect()` attached by Clerk,
    // but the exported TypeScript types may not include it. Narrow to an
    // unknown shape and call `protect` if present to satisfy the compiler.
    const maybeProtect = resolved as unknown as {
      protect?: (opts?: unknown) => unknown;
    };
    if (typeof maybeProtect.protect === "function") {
      maybeProtect.protect();
    }
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
