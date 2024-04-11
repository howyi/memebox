import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Button} from "@/components/ui/button";
import {MegaphoneIcon} from "@/components/top";
import {auth, ClerkProvider, SignInButton, UserButton} from "@clerk/nextjs";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: 'memebox',
};

export default async function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const {userId} = auth();
    return (
        <ClerkProvider>
            <html lang="en">
            <body className={inter.className}>
            <header className="flex items-center justify-between p-6 bg-emerald-300 shadow">
                <a href={'/'}>
                    <div className="flex items-center gap-2">
                        <MegaphoneIcon className="h-8 w-8"/>
                        <h1 className="text-2xl font-bold text-white">memebox</h1>
                    </div>
                </a>
                {!userId &&
                    <div className="flex items-center">
                        <Button className="ml-2 bg-white text-emerald-300" asChild><SignInButton>Sign In</SignInButton></Button>
                    </div>}
                {userId && <div className="flex gap-4 items-center">
                    <Button className="ml-2 bg-white text-emerald-300" asChild>
                        <a href={'/api/slack/install'}>Update
                        Slack
                        Webhooks</a>
                    </Button>
                    <UserButton/>
                </div>}
            </header>
            <main>
                {children}
            </main>
            </body>
            </html>
        </ClerkProvider>
    );
}
