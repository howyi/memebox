import {auth} from "@clerk/nextjs";
import {Top} from "@/components/top";
import {fetchMemes, getMeme} from "@/actions/memes";
import {MemesPage} from "@/components/memes-page";
import {useAuth} from "@/hooks/use-auth";

export default async function Page({ params }: { params: { slug: string } }) {
    const userId = await useAuth()

    if (!userId) {
        return <Top />
    }
    const memes = await fetchMemes()
    const selectedMeme = await getMeme(params.slug)

  return (
      <MemesPage memes={memes} selectedMeme={selectedMeme}/>
  )
}
