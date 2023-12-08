import { auth } from "../auth"
import {Memes} from "@/app/_components/Memes";

export default async function Home() {
  return (
    <main className="min-h-screen p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <a
            href="/api/auth/signin"
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >サインイン</a>
        <a
            href="/memes"
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >ミーム一覧へ</a>
        <a
            href="/api/auth/signout"
            className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >サインアウト</a>
      </div>
    </main>
  )
}
