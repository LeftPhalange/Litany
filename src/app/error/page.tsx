"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
    const router = useRouter();
    return (
        <div className="flex flex-col space-y-2 p-16">
            <Image src="/assets/logo.svg" alt="Litany logo" width={32} height={32} />
            <span>An error has occurred.</span>
            <span className="flex flex-row">
                <button onClick={() => { router.back(); }} className="block underline text-blue-500 hover:text-blue-400 pr-1">
                    Click here
                </button>
                to go back.
            </span>
        </div>
    );
}