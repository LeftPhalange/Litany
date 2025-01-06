"use client";

import { Fieldset, Input, Label } from "@headlessui/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { login, register } from "./actions";

/* Fields to help validate passwords */
// const MIN_PW_LENGTH = 6;
// const MAX_PW_LENGTH = 128;

export default function AuthenticationPage() {
    return (
        <div className="relative z-50 w-screen h-full">
            <div className="flex flex-col mx-auto w-screen h-screen items-center justify-center">
                <AuthenticationBox />
            </div>
        </div>
    )
}

enum AuthState {
    Login,
    Register
};

function AuthenticationBox() {
    /* Client-side states for authentication box */
    const [authState, setAuthState] = useState<AuthState>(AuthState.Login);
    // const [statusMessage, setStatusMessage] = useState<string>("");
    // const [emailAddress, setEmailAddress] = useState<string>("");
    // const [password, setPassword] = useState<string>("");

    /* credential validation below, e-mail regex from emailregex.com */
    // const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const isEmailValid = emailRegex.test(emailAddress);
    // const isPasswordValid = password.length >= MIN_PW_LENGTH && password.length <= MAX_PW_LENGTH;

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
                                <TabGroup setAuthState={setAuthState} />
                            </div>
                        </div>
                        <form>
                            <Fieldset className="flex flex-col text-left space-y-2">
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm">E-mail address</Label>
                                    <Input id="email" name="email" className="block rounded-md bg-neutral-800 text-white text-sm pl-2 py-1" type="email" required />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <Label className="text-sm">Password</Label>
                                    <Input id="password" name="password" className="block rounded-md bg-neutral-800 text-white text-sm pl-2 py-1" type="password" required></Input>
                                </div>
                            </Fieldset>
                            <button formAction={authState == AuthState.Login ? login : register} className={`block w-full mt-4 py-2 px-8 rounded-lg border border-1 ${authState == AuthState.Login ? "bg-sky-600 hover:bg-sky-500 border-sky-400" : "bg-indigo-600 hover:bg-indigo-500 border-indigo-400"} transition-all text-sm font-bold`}>
                                {authState == AuthState.Login ? "Log in" : "Register"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function TabGroup({ setAuthState }: { setAuthState: (state: AuthState) => void }) {
    const [selectedTab, setSelectedTab] = useState(0);
    const changeTab = (state: AuthState) => {
        setSelectedTab(state);
        setAuthState(state);
    };
    return (
        <div className="flex flex-row bg-white/15 rounded-xl space-x-2 p-1 w-fit justify-center">
            <Tab title={"Sign in"} selected={selectedTab == AuthState.Login} onClick={() => changeTab(AuthState.Login)} />
            <Tab title={"Register"} selected={selectedTab == AuthState.Register} onClick={() => changeTab(AuthState.Register)} />
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