import {db} from "@/app/_db/db";
import {memes, teams} from "@/app/_db/schema";
import {nanoid} from "nanoid";
import {eq} from "drizzle-orm";
import {IncomingWebhook} from "@slack/webhook";

export type InsertMeme = Omit<typeof memes.$inferInsert, 'id' | 'created_at'>

type CreatedMeme = {
    permalink: string
} & typeof memes.$inferInsert

export const NewMeme = async (meme: InsertMeme): Promise<CreatedMeme> => {
    const createMeme: typeof memes.$inferInsert = {
        id: nanoid(),
        created_at: new Date(),
        ...meme,
    }
    const team = await db.query.teams.findFirst({
        where: eq(teams.id, createMeme.slackTeamId)
    })
    if (!team || !team.installation) {
        throw new Error('not found')
    }
    await db.insert(memes).values(createMeme)
    const permalink = `${process.env.NEXTAUTH_URL}/${createMeme.id}`
    const webhook = new IncomingWebhook(team.installation.incomingWebhook?.url!)
    await webhook.send({
        text: createMeme.url ?? '',
        attachments: [
            {
                color: '#d8c968',
                author_name: createMeme.author || '発言者不明',
                author_link: permalink,
                text: createMeme.text || '未設定',
            }
        ]
    })
    return {
        permalink: permalink,
        ...createMeme,
    }
}