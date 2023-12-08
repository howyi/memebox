'use server'

import React from "react";
import {TrashIcon} from "@heroicons/react/20/solid";
import {deleteMeme, fetchMemes} from "@/app/_actions/memes";
import {AddMemeForm} from "@/app/_components/AddMemeForm";

export const Memes: React.FC = async () => {

    const memes = await fetchMemes()

    return <div>
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Memes</h1>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <div>
                        <AddMemeForm/>
                    </div>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300 table-fixed">
                            <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    ID
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    本文
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {memes.map((c) => (
                                <tr key={c.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                        {c.id}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{c.text}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right">

                                        <form action={deleteMeme}>
                                        <input
                                            type="hidden"
                                            name="meme_id"
                                            id="meme_id"
                                            value={c.id}
                                        />
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-red-600 bg-red-50 shadow-sm hover:bg-red-100"
                                        >
                                            <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                            削除
                                        </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
