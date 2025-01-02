"use client";

import { Button, Fieldset, Input, Label } from "@headlessui/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export default function AuthenticationPage() {
    return (
        <div className="relative z-50 w-screen h-full">
            <div className="flex flex-col mx-auto w-screen h-screen items-center justify-center">
                <AuthenticationBox />
            </div>
        </div>
    )
}

function AuthenticationBox() {
    return (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.0, opacity: 1.0 }} transition={{ duration: 0.25 }}>
            <div className={"bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl shadow-2xl shadow-cyan-700 p-1"}>
                <div className={"flex flex-col bg-black rounded-xl p-0"}>
                    <div className="flex flex-row space-x-2 px-4 py-3 bg-neutral-900 border-b border-1 border-neutral-800 rounded-t-xl">
                        <Image alt={"Litany logo"} src="/assets/logo.svg" width={16} height={16} />
                        <span className="text-sm font-semibold">
                            Welcome to Litany
                        </span>
                    </div>
                    <div className="flex flex-col p-8 space-y-4">
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm text-center break-words">To get started, please sign in or register below. </span>
                            <div className="flex flex-row justify-center">
                                <TabGroup />
                            </div>
                        </div>
                        <Fieldset className="text-left space-y-2">
                            <div className="flex flex-col space-y-1">
                                <Label className="text-sm">E-mail address</Label>
                                <Input className="block rounded-md bg-neutral-800 text-white text-sm pl-2 py-1"></Input>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label className="text-sm">Password</Label>
                                <Input className="block rounded-md bg-neutral-800 text-white text-sm pl-2 py-1"></Input>
                            </div>
                        </Fieldset>
                        <Button className="py-2 px-8 rounded-md bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-sky-500 hover:to-indigo-500 transition-all text-sm font-bold">
                            Log in
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function TabGroup() {
    const [selectedTab, setSelectedTab] = useState(0);
    return (
        <div className="flex flex-row bg-white/15 rounded-xl space-x-2 p-1 w-fit justify-center">
            <Tab title={"Sign in"} selected={selectedTab == 0} onClick={() => setSelectedTab(0)} />
            <Tab title={"Register"} selected={selectedTab == 1} onClick={() => setSelectedTab(1)} />
        </div>
    );
}

function Tab({ title, selected, onClick }: { title: string, selected: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} className={`block px-8 ${selected ? "bg-neutral-300 text-black" : "bg-neutral-600 text-white"} rounded-lg transition-all`}>
            <span className="text-sm font-semibold">
                {title}
            </span>
        </button>
    );
}