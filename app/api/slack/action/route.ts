import {NextRequest, NextResponse} from "next/server";
import {WebClient} from "@slack/web-api";
import {SLACK_CALLBACK_URL} from "@/app/_components/AddToSlackButton";
import {teams} from "@/app/_db/schema";
import {db} from "@/app/_db/db";
import {createEventAdapter} from "@slack/events-api";
import {NextApiHandler} from "next";
import express from "express"

export const dynamic = 'force-dynamic' // defaults to force-static

export const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET!, {
    includeBody: true,
    includeHeaders: true,
    waitForResponse: true
})

slackEvents.on('error', (error) => {
    console.log('SLACK EVENTS ERROR', slackEvents.signingSecret)
    console.log('SLACK EVENTS ERROR', process.env.SLACK_SIGNING_SECRET)
    console.log('SLACK EVENTS ERROR', error)
});

slackEvents.on('reaction_added', async (event, body, header) => {
    console.log('reaction added:', event)
    console.log('reaction body:', body)
    console.log('reaction header:', header)
    if (event.reaction != 'mega' || event.item.type != 'message') {
        return
    }
});

slackEvents.on('link_shared', async (event, body) => {
    console.log('link shared:', event)
});

const listener = slackEvents.requestListener();
export async function GET(request: NextRequest) {
    const res = new NextResponse()
    // @ts-ignore
    listener(request, res)
    return NextResponse.json({
        data: "test",
    })
}
export async function POST(request: NextRequest) {
    const res = new NextResponse()
    // @ts-ignore
    listener(request, res)
    // console.log(res.json())
    return NextResponse.json({date:"aa"})
}
