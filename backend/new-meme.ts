import {nanoid} from "nanoid";
import {eq} from "drizzle-orm";
import {IncomingWebhook} from "@slack/webhook";
import {memes, slack_installation} from "@/drizzle/schema";
import {db} from "@/drizzle";

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
    const team = await db.query.slack_installation.findFirst({
        where: eq(slack_installation.id, createMeme.slackTeamId)
    })
    const permalink = `${process.env.URL}/${createMeme.id}`
    await db.insert(memes).values(createMeme)
    if (team?.installation) {
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
    }
    return {
        permalink: permalink,
        ...createMeme,
    }
}