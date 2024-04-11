import {auth, clerkClient} from "@clerk/nextjs";
import {OauthAccessToken} from "@clerk/backend";

export async function useAuth(): Promise<string | undefined> {

    const {userId} = auth()

    if (!userId) {
        return undefined
    }

    const clerkAccessTokenResponse = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_slack') as OauthAccessToken[];

    if (clerkAccessTokenResponse.length > 0) {
        return userId
    }

    return undefined
}