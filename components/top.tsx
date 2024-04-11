/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kR8HJRkRLhN
 */
import React from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {auth, SignOutButton, UserButton} from "@clerk/nextjs";

export const Top = () => {

    const {userId} = auth()

    return (
        <div className="flex h-[calc(100vh-88px)] w-full flex-col items-center justify-center">
            <MegaphoneIcon className="h-16 w-16 text-red-600"/>
            <h1 className="mt-4 text-4xl font-bold">memebox</h1>
            <a href={'/api/slack/install'}>
                <Button className="mt-4 bg-emerald-300 text-white">Add To Slack</Button>
            </a>
            {userId &&
                <div className={'items-center text-center flex flex-col gap-4'}>
                    <div> To use this service, you must have an sbox.studio account linked with a Slack account.
                    </div>
                    <div className={'flex flex-row gap-2 bg-muted p-2 rounded-md'}><UserButton
                        afterSwitchSessionUrl={'/'}/>
                        <div className={'my-auto'}>👈 Click here to link your currently signed-in account with Slack,
                            then sign in again.
                        </div>
                    </div>
                    <div>
                        <Button variant={'outline'} asChild>
                            <SignOutButton>Sign out</SignOutButton>
                        </Button>
                    </div>
                </div>
            }

            {/*<div className="mt-4 flex flex-col items-center">*/}
            {/*<a className="text-sm text-black hover:underline" href="https://howyi.notion.site/8d695611e402429a9b47e30aa9f7b232?pvs=4">*/}
            {/*    利用規約*/}
            {/*</a>*/}
            {/*<a className="mt-2 text-sm text-black hover:underline" href="https://howyi.notion.site/70d5ec586fa84dabac13ed86d1307837?pvs=4">*/}
            {/*    プライバシーポリシー*/}
            {/*</a>*/}
            {/*</div>*/}
        </div>
    )
}

export function MegaphoneIcon(props: any) {
    return (
        <Image
            width={100}
            height={100}
            src={'./logo.svg'}
            alt={'logo'}
            {...props}
        />
    )
}
