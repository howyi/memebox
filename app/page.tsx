import {auth} from "@/app/auth";
import {MemesPage} from "@/app/_components/memes-page";
import {fetchMemes, getMeme} from "@/app/_actions/memes";
import {Top} from "@/app/_components/top";

export default async function Home() {
    const session = await auth()

    if (!session) {
        return <Top />
    }
    const memes = await fetchMemes()
  return (
      <MemesPage memes={memes}/>
  )
}
