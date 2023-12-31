import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import {Button} from "@/app/_components/ui/button";
import {MegaphoneIcon, Top} from "@/app/_components/top";
import {auth} from "@/app/auth";
import React from "react";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'memebox',
}

// 認証不要のRouteGroups
export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <html lang="en">
            <body className={inter.className}>
                <header className="flex items-center justify-between p-6 bg-emerald-300 shadow">
                    <a href={'/'}>
                        <div className="flex items-center gap-2">
                            <MegaphoneIcon className="h-8 w-8"/>
                            <h1 className="text-2xl font-bold text-white">memebox</h1>
                        </div>
                    </a>
                    {!session &&
                        <div className="flex items-center">
                            <a href={'/api/auth/signin'}>
                        <Button className="ml-2 bg-white text-emerald-300">Sign In</Button>
                            </a>
                        </div>}
                    {session && <div className="flex items-center">
                        <a href={'/api/slack/install'}>
                            <Button className="ml-2 bg-white text-emerald-300">Update Slack Webhooks</Button></a>
                        <a href={'/api/auth/signout'}>
                            <Button className="ml-2 bg-white text-emerald-300">Sign Out</Button>
                        </a>
                    </div>}
                </header>
                <main>
                    {children}
                </main>
            </body>
        </html>
    )
}
