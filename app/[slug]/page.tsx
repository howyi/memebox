import {auth} from "@clerk/nextjs";
import {Top} from "@/components/top";
import {fetchMemes, getMeme} from "@/actions/memes";
import {MemesPage} from "@/components/memes-page";

export default async function Page({ params }: { params: { slug: string } }) {
    const {userId} = auth()

    if (!userId) {
        return <Top />
    }
    const memes = await fetchMemes()
    const selectedMeme = await getMeme(params.slug)

  return (
      <MemesPage memes={memes} selectedMeme={selectedMeme}/>
  )
}
