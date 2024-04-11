'use server'

import {and, desc, eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {db} from "@/drizzle";
import * as schema from "@/drizzle/schema";
import {NewMeme} from "@/backend/new-meme";
import {auth, clerkClient} from "@clerk/nextjs";
import {OauthAccessToken} from "@clerk/backend";
import {OpenIDConnectUserInfoResponse, TeamInfoResponse, UsersProfileGetResponse} from "@slack/web-api";

export const fetchMemes = async (): Promise<typeof schema.memes.$inferSelect[]> => {
    const user = await authenticate()
    return db.query.memes.findMany({
        where: eq(schema.memes.slackTeamId, user.teamId),
        orderBy: [desc(schema.memes.created_at)],
        limit: 100,
    });
}

export const getMeme = async (memeId: string): Promise<typeof schema.memes.$inferSelect> => {
    const user = await authenticate()
    const found = await db.query.memes.findFirst({
        where: and(eq(schema.memes.slackTeamId, user.teamId), eq(schema.memes.id, memeId) ),
    });
    if (!found) {
        throw new Error('not found')
    }
    return found
}

export const addMeme = async (formData: FormData) => {
    const user = await authenticate()
    await NewMeme( {
        text: formData.get("text") as string,
        slackTeamId: user.teamId,
    });
    revalidatePath("/");
}

export const deleteMeme = async (formData: FormData) => {
    const user = await authenticate()
    const meme_id = formData.get("meme_id") as string
    await db.delete(schema.memes)
        .where(and(eq(schema.memes.id, meme_id), eq(schema.memes.slackTeamId, user.teamId)))
    redirect("/");
}

export const updateMeme = async (memeId: string, text: string, author: string) => {
    const user = await authenticate()
    await db.update(schema.memes).set({
        id: memeId,
        slackTeamId: user.teamId,
        text,
        author,
    }).where(and (eq(schema.memes.id, memeId), eq(schema.memes.slackTeamId, user.teamId)));
    revalidatePath("/" + memeId);
}

const authenticate = async (): Promise<{ teamId:string, id:string }> => {
    const { userId } = auth();
    if (!userId) {
        throw new Error("Unauthenticated")
    }
    const clerkAccessTokenResponse = await clerkClient.users.getUserOauthAccessToken(userId, 'oauth_slack') as OauthAccessToken[];
    for (let oauthAccessToken of clerkAccessTokenResponse) {
        const slackConnectInfoResponse = await fetch('https://slack.com/api/openid.connect.userInfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${oauthAccessToken.token}`
            }
        })
        const userInfo = await slackConnectInfoResponse.json() as OpenIDConnectUserInfoResponse
        if (userInfo["https://slack.com/team_id"] === undefined) {
            continue
        }
        return {id: userId, teamId: userInfo["https://slack.com/team_id"]}
    }
    throw new Error("Unauthenticated")
}
