'use server'

import {db} from "@/app/_db/db";
import * as schema from "@/app/_db/schema";
import {and, desc, eq} from "drizzle-orm";
import {auth} from "@/app/auth";
import {revalidatePath} from "next/cache";
import {NewMeme} from "@/app/_server/meme";

export const fetchMemes = async (): Promise<typeof schema.memes.$inferSelect[]> => {
    const user = await authenticate()
    return db.query.memes.findMany({
        where: eq(schema.memes.slackTeamId, user.teamId),
        orderBy: [desc(schema.memes.created_at)],
        limit: 100,
    });
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
    revalidatePath("/");
}

const authenticate = async (): Promise<{ teamId:string, id:string }> => {
    const session = await auth()
    if (!session) {
        throw new Error("Unauthenticated")
    }
    const account = await db.query.accounts.findFirst({
        where: eq(schema.accounts.userId, session.user.id!)
    })
    if (!account) {
        throw new Error("Unauthenticated")
    }
    const team = await db.query.user_slack_teams.findFirst({
        where: eq(schema.user_slack_teams.slackUserId, account.providerAccountId)
    })
    if (!team) {
        throw new Error("Unauthenticated")
    }
    return {id: session.user.id, teamId:team.id}
}
