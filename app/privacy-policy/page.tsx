import {Button} from "@/app/_components/ui/button";

export default async function Page({ params }: { params: { slug: string } }) {

  return <div className="flex flex-col h-screen bg-white">
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
}
