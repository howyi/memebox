import {Button} from "@/app/_components/ui/button";
import {auth} from "@/app/auth";
import {MemesPage} from "@/app/_components/memes-page";
import {fetchMemes, getMeme} from "@/app/_actions/memes";

export default async function Home() {
    const session = await auth()

    if (!session) {
        return (
            <div className="flex flex-col h-screen bg-white">
                <header className="flex items-center justify-between p-6 bg-green-500 shadow">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-white">memebox</h1>
                    </div>
                    <div className="flex items-center">
                        <a href={'/api/auth/signin'}>
                            <Button className="ml-2 bg-white text-green-500">Sign In</Button>
                        </a>
                    </div>
                </header>
            </div>
        )
    }
    const memes = await fetchMemes()
  return (
      <MemesPage memes={memes}/>
  )
}
