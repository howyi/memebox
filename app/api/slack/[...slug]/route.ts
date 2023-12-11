import NextRouteHandlerReceiver from "@/app/api/slack/[...slug]/NextRouteHandlerReceiver";
import {App, LinkUnfurls} from "@slack/bolt";
import {db} from "@/app/_db/db";
import {eq} from "drizzle-orm";
import {memes, teams} from "@/app/_db/schema";
import {nanoid} from "nanoid";
import * as schema from "@/app/_db/schema";

export const dynamic = 'force-dynamic' // defaults to force-static

const baseApiPath = 'https://localhost:3001/api/slack'
const oauthRedirectPath = '/oauth_redirect'
const installPath = '/install'
const eventPath = '/events'
const loginRedirectUri = 'https://localhost:3001/memes'

const receiver = new NextRouteHandlerReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    installerOptions: {
        stateVerification: true,
        userScopes: [
            'users:read',
        ],
        redirectUriPath: oauthRedirectPath
    },
    oauthRedirectPath,
    installPath,
    eventPath,
    scopes: [
        'incoming-webhook',
        'commands',
        'links:read',
        'reactions:read',
        'channels:history',
        'groups:history',
        'mpim:history',
        'im:history',
        'users:read',
        'links:write',
    ],
    stateSecret: process.env.SLACK_STATE_SECRET,
    installationStore: {
        storeInstallation: async (installation) => {
            const model: typeof teams.$inferInsert = {
                id: installation.team?.id!,
                installation
            }
            await db.insert(teams).values(model).onDuplicateKeyUpdate({set: model})
        },
        fetchInstallation: async (InstallQuery) => {
            const team = await db.query.teams.findFirst({
                where: eq(teams.id, InstallQuery.teamId!)
            })
            if (!team || !team.installation) {
                throw new Error('not found')
            }
            return team.installation
        },
    },
    redirectUri: baseApiPath + oauthRedirectPath,
    loginRedirectUri,
})

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    processBeforeResponse: false,
    receiver,
})

app.event('reaction_added', async ({event, client, context}) => {
    if (event.reaction != 'mega' || event.item.type != 'message') {
        return
    }
    const permalink = (await client.chat.getPermalink({
        channel: event.item.channel,
        message_ts: event.item.ts,
    })).permalink

    const conversations = (await client.conversations.history({
        channel: event.item.channel,
        latest: event.item.ts,
        limit: 1,
        inclusive: true
    })).messages

    const user = (await client.users.info({
        user: event.item_user,
    })).user

    if (!conversations || !conversations[0] || !user) {
        return
    }

    await db.insert(memes).values({
        id: nanoid(),
        slackTeamId: context.teamId,
        url: permalink,
        text: conversations[0].text,
        author: user.profile?.display_name || user.real_name || user.name,
    })
})

app.event('link_shared', async ({event, client, context}) => {
    console.log('link shared:', event)

    const regMemeIdFromUrl = /memes\/([\w-]*)/

    const unfurls: LinkUnfurls = {}
    for (const link of event.links) {
        const result = regMemeIdFromUrl.exec(link.url)
        if (!result) {
            return
        }
        const memeId = result[1]

        const meme = await db.query.memes.findFirst({
            where: eq(memes.id, memeId)
        })

        if (!meme) {
            return
        }

        unfurls[link.url] = {
            color: '#1a9dab',
            author_name: meme.author || '発言者不明',
            author_link: `${process.env.NEXTAUTH_URL}/memes/${meme.id}`,
            text: meme.text || '未設定',
        }
    }

    await client.chat.unfurl({
        channel: event.channel,
        ts: event.message_ts,
        unfurls
    })
})

app.shortcut('add_meme', async ({shortcut, ack, client, logger}) => {
    if (shortcut.type !== 'message_action') {
        return
    }
    await ack()

    const permalink = (await client.chat.getPermalink({
        channel: shortcut.channel.id,
        message_ts: shortcut.message_ts,
    })).permalink

    if (!permalink) {
        return
    }

    await db.insert(memes).values({
        id: nanoid(),
        slackTeamId: shortcut.team?.id,
        url: permalink,
        text: shortcut.message.text,
        author: shortcut.message.user,
    })
})

app.shortcut('new_meme', async ({shortcut, ack, client, logger}) => {
    if (shortcut.type !== 'shortcut') {
        return
    }
    await ack()

    await client.views.open({
        trigger_id: shortcut.trigger_id,
        view: {
            type: "modal",
            callback_id: "new_meme_submit",
            submit: {
                type: "plain_text",
                text: "登録"
            },
            title: {
                type: "plain_text",
                text: "ミームの新規登録"
            },
            close: {
                type: "plain_text",
                text: "Close"
            },
            blocks: [
                {
                    type: "input",
                    element: {
                        type: "plain_text_input",
                        action_id: "speaker",
                        placeholder: {
                            type: "plain_text",
                            text: "誰がこのミームを発言しましたか？"
                        }
                    },
                    label: {
                        type: "plain_text",
                        text: "発言者"
                    }
                },
                {
                    type: "input",
                    element: {
                        type: "plain_text_input",
                        action_id: "title",
                    },
                    label: {
                        type: "plain_text",
                        text: "ミーム"
                    }
                }
            ]
        }
    })
})

app.view('new_meme_submit', async ({
                                       ack,
                                       body,
                                       view,
                                       client,
                                       logger,
                                   }) => {
    await ack()

    const meme: typeof schema.memes.$inferInsert = {
        id: nanoid(),
        slackTeamId: body.team?.id,
        text: '',
        author: '',
    }
    for (const value of Object.values(view.state.values)) {
        if (value.speaker) {
            meme.author = value.speaker.value
        }
        if (value.title) {
            meme.text = value.title.value
        }
    }
    console.log('submit2', view.state.values)

    await db.insert(memes).values(meme)

    await client.views.update({
        view_id: body.view.id,
        hash: body.view.hash,
        view: {
            type: 'modal',
            title: {
                type: 'plain_text',
                text: 'ミームを登録しました',
                emoji: true
            },
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "plain_text",
                        text: `${process.env.NEXTAUTH_URL}/memes/${meme.id}`,
                        emoji: true
                    }
                }
            ],
        },
    })
})

app.command('/memebox2', async ({ command, ack, respond }) => {

    await respond({
        response_type: 'ephemeral',
        text: ':wave: `/memebox`で様々なコマンドが使用できます :chicken: ',
        attachments: [
            {
                text: 'ミームを新しく追加する:\n `/memebox add [newMeme]`',
            },
            {
                text: 'チーム内のミームをマルコフ連鎖した結果を投稿する:\n `/memebox markov`',
            },
            {
                text: 'チーム内のミームをランダムに投稿する:\n `/memebox random`',
            }
        ]
    });
});

const handler = await receiver.start()

export {handler as GET, handler as POST}