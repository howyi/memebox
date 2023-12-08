import {Memes} from "@/app/_components/Memes";
import {AddToSlackButton} from "@/app/_components/AddToSlackButton";

export default async function Home() {
    return (
        <main className="min-h-screen p-24">
            <div className="z-10 max-w-5xl w-full font-mono text-sm">
                <a
                    href="/api/auth/signout"
                    className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >Sign out</a>
                <AddToSlackButton/>
                <Memes/>
            </div>
        </main>
    )
}
