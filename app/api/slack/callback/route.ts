import {NextRequest, NextResponse} from "next/server";
import {WebClient} from "@slack/web-api";
import {SLACK_CALLBACK_URL} from "@/app/_components/AddToSlackButton";
import {teams} from "@/app/_db/schema";
import {db} from "@/app/_db/db";

export const dynamic = 'force-dynamic' // defaults to force-static
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const web = new WebClient();
    const accessResult = await web.oauth.v2.access({
        code: code!,
        client_id: process.env.SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        redirect_uri: SLACK_CALLBACK_URL,
    })
    const model: typeof teams.$inferInsert = {
        id: accessResult.team?.id!,
        access_token: accessResult.access_token!,
        bot_user_id: accessResult.bot_user_id!!,
        incoming_webhook_channel_id: accessResult.incoming_webhook?.channel_id!,
        incoming_webhook_channel_name: accessResult.incoming_webhook?.channel!,
        incoming_webhook_configuration_url: accessResult.incoming_webhook?.url!,
        incoming_webhook_url: accessResult.incoming_webhook?.url!,
    }
    await db.insert(teams).values(model).onDuplicateKeyUpdate({ set: model })
    return NextResponse.redirect( process.env.NEXTAUTH_URL + '/memes')
}
