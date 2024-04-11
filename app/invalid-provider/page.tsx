import {RedirectToSignIn, SignedOut, SignOutButton, UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";

export default async function Page() {
    return (
        <div className={'p-14 text-center'}>
            <SignedOut>
                <RedirectToSignIn redirectUrl={'/'} />
            </SignedOut>
            <div className={'items-center text-center flex flex-col gap-4'}>
                <div> To use this service, you must have an sbox.studio account linked with a Slack account.
                </div>
                <div className={'flex flex-row gap-2 bg-muted p-2 rounded-md'}><UserButton afterSwitchSessionUrl={'/'}/>
                    <div className={'my-auto'}>👈 Click here to link your currently signed-in account with Slack, then sign in again.</div>
                </div>
                <div>
                    <Button variant={'outline'} asChild>
                        <SignOutButton>Sign in with another account</SignOutButton>
                    </Button>
                </div>
            </div>
        </div>
    );
}
