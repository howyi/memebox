'use client'

/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/xoZ8wELRgcb
 */
import React, {useEffect, useState} from "react";
import * as schema from "@/drizzle/schema";
import {AddMemeForm} from "@/components/add-meme-form";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {deleteMeme, updateMeme} from "@/actions/memes";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export type Meme = typeof schema.memes.$inferSelect

export const MemesPage: React.FC<{ memes: Meme[], selectedMeme?: Meme }> = ({memes, selectedMeme}) => {

    const [currentSelectedMeme, setCurrentSelectedMeme] = useState<Meme | undefined>(selectedMeme)

    const [newMemeText, setNewMemeText] = useState(currentSelectedMeme?.text || '')
    const [newMemeAuthor, setNewMemeAuthor] = useState(currentSelectedMeme?.author || '')

    useEffect(() => {
        // Always do navigations after the first render
        window.history.pushState(null, '', currentSelectedMeme ? `/${currentSelectedMeme.id}` : '/')
        setNewMemeText(currentSelectedMeme?.text || '')
        setNewMemeAuthor(currentSelectedMeme?.author || '')
    }, [currentSelectedMeme])

    return (
        <div className="flex flex-col h-screen bg-white">
            <main className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-emerald-300">Memes</h2>
                    <AddMemeForm/>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-6 xl:grid-cols-8">

                    {memes.map((meme) => (
                        <Card
                            className="shadow-sm rounded-lg overflow-hidden transform hover:scale-105 transition-transform cursor-pointer"
                            onClick={(e) => {
                                setCurrentSelectedMeme(meme)
                            }}
                            key={meme.id}
                        >
                            <CardHeader className="flex flex-col items-start p-4 h-24 overflow-y-auto">
                                <CardTitle
                                    className="text-sm font-bold whitespace-pre-line">{meme.text || ''}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2 px-4">
                                <p className="mb-2 text-xs">{meme.author || ''}</p>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start p-4">
                                <CardTitle className={"text-sm font-light" + (meme.url ? ' underline' : '')}>
                                    {meme.url &&
                                        <a href={meme.url} onClick={e => {
                                            e.stopPropagation()
                                        }}>
                                            {ConvertJST(meme.created_at)}
                                        </a>
                                        || ConvertJST(meme.created_at)}
                                </CardTitle>
                            </CardFooter>
                        </Card>
                    ))}

                </div>
            </main>

            {currentSelectedMeme &&
                <Dialog open={!!currentSelectedMeme} onOpenChange={(c) => {
                    if (!c) {
                        setCurrentSelectedMeme(undefined)
                    }
                }}>
                    <DialogContent className="flex flex-col pt-12">
                        <Textarea
                            id="text"
                            name="text"
                            rows={3}
                            value={newMemeText}
                            onChange={(e) => setNewMemeText(e.target.value)}
                        />
                        <Input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            placeholder="janesmith"
                            value={newMemeAuthor}
                            onChange={(e) => setNewMemeAuthor(e.target.value)}
                        />
                        <p className="text-sm text-gray-500">
                            {currentSelectedMeme.url &&
                                <a className={'underline'} href={currentSelectedMeme.url}
                                   onClick={e => {
                                       e.stopPropagation()
                                   }}>
                                    {ConvertJST(currentSelectedMeme.created_at)}
                                </a>
                                || ConvertJST(currentSelectedMeme.created_at)}
                        </p>
                        <div className={'flex flex-row mt-4 gap-2'}>
                            <div className={'flex-1'}>

                                <form action={deleteMeme}>
                                    <input
                                        type="hidden"
                                        name="meme_id"
                                        id="meme_id"
                                        value={currentSelectedMeme.id}
                                    />
                                    <Button
                                        type="submit"
                                       variant={'destructive'}
                                    >
                                        削除
                                    </Button>
                                </form>
                            </div>
                            <div>
                                <Button
                                    onClick={() => setCurrentSelectedMeme(undefined)}
                                    type="button"
                                    variant={'outline'}
                                >
                                    キャンセル
                                </Button>
                            </div>
                            <div>
                                <form action={async () => {
                                    await updateMeme(currentSelectedMeme?.id, newMemeText, newMemeAuthor)
                                }}>
                                    <Button
                                        type="submit"
                                        variant={'default'}
                                    >
                                        更新
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            }
        </div>
    )
}

const ConvertJST = (date: Date) => {
    return date.toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
    });
}
