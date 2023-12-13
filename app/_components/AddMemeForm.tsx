'use client'

import React from "react";
import {addMeme} from "@/app/_actions/memes";
import {Button} from "@/app/_components/ui/button";

export const AddMemeForm: React.FC = () => {
    const ref = React.useRef<HTMLFormElement>(null)
    const [disabled, setDisabled] = React.useState(false)
    return <form
        onSubmit={() => setDisabled(true)}
        action={async (formData) => {
            if (formData.get("text") == "") {
                setDisabled(false)
                return
            }
            try {
                await addMeme(formData)
            } catch (e) {
                throw e
            } finally {
                setDisabled(false)
            }
            ref.current?.reset()
        }}
        className="mt-2 flex rounded-md shadow-sm"
        ref={ref}
    >
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
                type="text"
                name="text"
                id="text"
                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="本文"
                disabled={disabled}
            />
        </div>
        <Button type={'submit'} disabled={disabled} className="bg-green-500 text-white">{disabled ? '追加中' : '追加'}</Button>
    </form>
}
