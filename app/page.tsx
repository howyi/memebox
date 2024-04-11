import {auth} from "@clerk/nextjs";
import {Top} from "@/components/top";
import {fetchMemes} from "@/actions/memes";
import {MemesPage} from "@/components/memes-page";
import {useAuth} from "@/hooks/use-auth";

export default async function Home() {
  const userId = await useAuth()

  if (!userId) {
    return <Top />
  }

  const memes = await fetchMemes()
  return (
      <MemesPage memes={memes}/>
  )
}
