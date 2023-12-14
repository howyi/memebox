import {Button} from "@/app/_components/ui/button";
import {auth} from "@/app/auth";
import {MemesPage} from "@/app/_components/memes-page";
import {fetchMemes, getMeme} from "@/app/_actions/memes";

export default async function Page({ params }: { params: { slug: string } }) {
    const session = await auth()

    if (!session) {
        return
    }
    const memes = await fetchMemes()
    const selectedMeme = await getMeme(params.slug)

  return (
      <MemesPage memes={memes} selectedMeme={selectedMeme}/>
  )
}
