'use client'

/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/xoZ8wELRgcb
 */
import {Button} from "@/app/_components/ui/button"
import {CardTitle, CardHeader, CardContent, Card, CardFooter} from "@/app/_components/ui/card"
import {deleteMeme, updateMeme} from "@/app/_actions/memes";
import {AddMemeForm} from "@/app/_components/AddMemeForm";
import React, {Fragment, useEffect, useState} from "react";
import * as schema from "@/app/_db/schema";
import {Dialog, Transition} from "@headlessui/react";

export type Meme = typeof schema.memes.$inferSelect

export const MemesPage: React.FC<{ memes: Meme[], selectedMeme?: Meme }> = ({memes, selectedMeme}) => {

    const [currentSelectedMeme, setCurrentSelectedMeme] = useState<Meme | undefined>(selectedMeme)

    const [newMemeText, setNewMemeText] = useState(currentSelectedMeme?.text || '')
    const [newMemeAuthor, setNewMemeAuthor] = useState(currentSelectedMeme?.author || '')

    useEffect(() => {
        // Always do navigations after the first render
        window.history.pushState('', '', currentSelectedMeme ? `/${currentSelectedMeme.id}` : '/')
        setNewMemeText(currentSelectedMeme?.text || '')
        setNewMemeAuthor(currentSelectedMeme?.author || '')
        // router.push(currentSelectedMeme ? `/${currentSelectedMeme.id}` : '/', { shallow: true })
    }, [currentSelectedMeme])

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="flex items-center justify-between p-6 bg-green-500 shadow">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white">memebox</h1>
                </div>
                <div className="flex items-center">
                    <a href={'/api/slack/install'}>
                        <Button className="ml-2 bg-white text-green-500">Update Slack Webhooks</Button></a>
                    <a href={'/api/auth/signout'}>
                        <Button className="ml-2 bg-white text-green-500">Sign Out</Button>
                    </a>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-green-500">Memes</h2>
                    <AddMemeForm/>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-8">

                    {memes.map((meme) => (
                        <Card
                            className="shadow-sm rounded-lg overflow-hidden transform hover:scale-105 transition-transform cursor-pointer"
                            onClick={(e) => {
                                setCurrentSelectedMeme(meme)
                            }}
                            key={meme.id}
                        >
                            <CardHeader className="flex flex-col items-start p-4 h-52 overflow-y-auto">
                                <CardTitle className="text-md font-bold whitespace-pre-line">{meme.text || ''}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2 px-4">
                                <p className="mb-2 text-xs">{meme.author || ''}</p>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start p-4">
                                <CardTitle className={"text-sm font-light" + (meme.url ? ' underline' : '')}>
                                    {meme.url &&
                                        <a href={meme.url} onClick={e => {e.stopPropagation()}}>
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
                <Transition.Root show={!!currentSelectedMeme} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => setCurrentSelectedMeme(undefined)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div
                                className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel
                                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                        <div>
                                            <div className="mt-3 text-center sm:mt-5">
                                                <div
                                                    className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                    <textarea
                                                        id="about"
                                                        name="about"
                                                        rows={3}
                                                        className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        value={newMemeText}
                                                        onChange={(e) => setNewMemeText(e.target.value)}
                                                    />
                                                </div>
                                                <div
                                                    className="my-4 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        id="username"
                                                        autoComplete="username"
                                                        className=" text-center block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                        placeholder="janesmith"
                                                        value={newMemeAuthor}
                                                        onChange={(e) => setNewMemeAuthor(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mt-2">
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
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'flex flex-row mt-4 '}>
                                            <div className={'flex-1'}>

                                                <form action={deleteMeme}>
                                                    <input
                                                        type="hidden"
                                                        name="meme_id"
                                                        id="meme_id"
                                                        value={currentSelectedMeme.id}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="rounded text-red-400 p-1 shadow-sm hover:bg-red-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    >
                                                        削除
                                                    </button>
                                                </form>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => setCurrentSelectedMeme(undefined)}
                                                    type="button"
                                                    className="rounded p-1 shadow-sm hover:bg-red-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    キャンセル
                                                </button>
                                            </div>
                                            <div>
                                                <form action={async () => {
                                                    await updateMeme(currentSelectedMeme?.id, newMemeText, newMemeAuthor)
                                                }}>
                                                    <button
                                                        type="submit"
                                                        className="rounded p-1 shadow-sm hover:bg-red-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    >
                                                        更新
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            }
        </div>
    )
}

const ConvertJST = (date: Date) => {
    return date.toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
    });
}
