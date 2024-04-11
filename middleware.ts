import {authMiddleware, clerkClient, redirectToSignIn} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import {TeamInfoResponse} from "@slack/web-api";
import {OauthAccessToken} from "@clerk/backend";

export default authMiddleware({
    publicRoutes: ['/', '/invalid-provider'],
    ignoredRoutes: ['/api/slack/oauth_redirect', '/api/slack/events'],
    async afterAuth(auth, req, evt) {
        if (auth.isPublicRoute) {
            return NextResponse.next();
        }
        if (!auth.userId) {
            return redirectToSignIn({returnBackUrl: req.url});
        }

        const clerkAccessTokenResponse = await clerkClient.users.getUserOauthAccessToken(auth.userId, 'oauth_slack') as OauthAccessToken[];

        if (clerkAccessTokenResponse.length > 0) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/invalid-provider", req.url));
    }
});

export const config = {
    matcher: ["/((?!.+.[w]+$|_next|favicon.ico).*)", "/", "/(api|trpc)(.*)"],
};