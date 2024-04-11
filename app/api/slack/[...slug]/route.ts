import NextRouteHandlerReceiver from "@/app/api/slack/[...slug]/NextRouteHandlerReceiver";
import {App, LinkUnfurls} from "@slack/bolt";
import {db} from "@/drizzle";
import {and, eq, sql} from "drizzle-orm";
import {memes, slack_installation} from "@/drizzle/schema";
import MarkovChain from "@hideokamoto/markov-chain-tiny";
import {InsertMeme, NewMeme} from "@/backend/new-meme";

export const dynamic = 'force-dynamic' // defaults to force-static

const baseApiPath = process.env.URL + '/api/slack'
const oauthRedirectPath = '/oauth_redirect'
const installPath = '/install'
const eventPath = '/events'
const loginRedirectUri = process.env.URL

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
            const model: typeof slack_installation.$inferInsert = {
                id: installation.team?.id!,
                installation
            }
            await db.insert(slack_installation).values(model).onConflictDoUpdate({
                target: slack_installation.id,
                set: {
                    installation,
                }
            })
        },
        fetchInstallation: async (InstallQuery) => {
            const team = await db.query.slack_installation.findFirst({
                where: eq(slack_installation.id, InstallQuery.teamId!)
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

    await NewMeme({
        slackTeamId: context.teamId!,
        url: permalink,
        text: conversations[0].text,
        author: user.profile?.display_name || user.real_name || user.name,
    })
})

app.event('link_shared', async ({event, client, context}) => {
    console.log('link shared:', event)

    const regMemeIdFromUrl = /.app\/([\w-]*)/

    const unfurls: LinkUnfurls = {}
    for (const link of event.links) {
        const result = regMemeIdFromUrl.exec(link.url)
        if (!result) {
            return
        }
        const memeId = result[1]

        const meme = await db.query.memes.findFirst({
            where: and(eq(memes.slackTeamId, context.teamId!), eq(memes.id, memeId))
        })

        if (!meme) {
            return
        }

        unfurls[link.url] = {
            color: '#1a9dab',
            author_name: meme.author || '発言者不明',
            author_link: `${process.env.URL}/${meme.id}`,
            text: meme.text || '未設定',
        }
    }

    await client.chat.unfurl({
        channel: event.channel,
        ts: event.message_ts,
        unfurls
    })
})

app.shortcut('add_meme', async ({shortcut, ack, client, logger, context}) => {
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

    const user = (await client.users.info({
        user: shortcut.message.user!,
    })).user

    if (!user) {
        return
    }

    await NewMeme({
        slackTeamId: context.teamId!,
        url: permalink,
        text: shortcut.message.text,
        author: user.profile?.display_name || user.real_name || user.name,
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
                                        context,
                                       logger,
                                   }) => {
    const meme: InsertMeme = {
        slackTeamId: context.teamId!,
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
    const created = await NewMeme(meme)

    await ack({
        response_action: 'update',
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
                        text: created.permalink,
                        emoji: true
                    }
                }
            ],
        },
    })
})

const COMMAND = '/memebox'
// テキストからコマンドと本文を取得する正規表現
const regCommandFromText = /^(\w+)\s?(.*)$/
app.command(COMMAND, async ({ command, respond, ack, body, context }) => {
    console.log(command.text)


    const result = regCommandFromText.exec(command.text)
    if (result) {
        const command = result[1] ?? ''
        const commandBody = result[2] ?? ''

        switch (command) {
            case('add'): {
                const meme = await NewMeme({
                    slackTeamId: context.teamId!,
                    text: commandBody,
                    author: '',
                })

                await respond({
                    response_type: 'ephemeral',
                    text: `作成しました: ${process.env.URL}/${meme.id}`,
                })
                return
            }
            case('markov'): {
                const foundMemes = await db.query.memes.findMany({
                    where: eq(memes.slackTeamId, context.teamId!),
                    orderBy: sql<string>`random()`,
                    limit: 10
                })
                if (foundMemes.length == 0) {
                    await respond({
                        response_type: 'ephemeral',
                        text: `memes not found`,
                    })
                }
                let text = ''
                // 全部ではなくランダムで取得した100個のmemeから生成する
                for (const meme of foundMemes) {
                    text += meme.text
                }
                const markov = new MarkovChain(text)
                const sentence = markov.makeSentence()

                await respond({
                    response_type: 'in_channel',
                    text: sentence
                })
                return
            }
            case('random'): {
                const foundMeme = await db.query.memes.findFirst({
                    where: eq(memes.slackTeamId, context.teamId!),
                    orderBy: sql<string>`random()`,
                })
                if (!foundMeme) {
                    await respond({
                        response_type: 'ephemeral',
                        text: `memes not found`,
                    })
                    return
                }

                const linkText = foundMeme.url ? foundMeme.url : ""
                await respond({
                    response_type: 'in_channel',
                    text: linkText,
                    attachments: [
                        {
                            color: '#1a9dab',
                            author_name: foundMeme.author || '発言者不明',
                            author_link: `${process.env.URL}/${foundMeme.id}`,
                            text: foundMeme.text || '未設定',
                        },
                    ]
                })
                return
            }
        }
    }
    await respond({
        response_type: 'ephemeral',
        text: `:wave: \`${COMMAND}\`で様々なコマンドが使用できます :chicken: `,
        attachments: [
            {
                text: `ミームを新しく追加する:\`${COMMAND} add [newMeme]\``,
            },
            {
                text: `チーム内のミームをマルコフ連鎖した結果を投稿する: \`${COMMAND} markov\``,
            },
            {
                text: `チーム内のミームをランダムに投稿する: \`${COMMAND} random\``,
            }
        ]
    });
});

const handler = await receiver.start()

export {handler as GET, handler as POST}