import {auth} from "@clerk/nextjs";
import {Top} from "@/components/top";
import {fetchMemes} from "@/actions/memes";
import {MemesPage} from "@/components/memes-page";

export default async function Home() {
  const {userId} = auth()

  if (!userId) {
    return <Top />
  }

  const memes = await fetchMemes()
  return (
      <MemesPage memes={memes}/>
  )
}
