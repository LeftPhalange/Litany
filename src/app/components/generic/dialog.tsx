"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "motion/react";
import { JSX } from "react";
import { FaPencil } from "react-icons/fa6";

export default function DialogBox({ title, content, open }: { title: string, content: JSX.Element, open: boolean }) {
    return (
        <Dialog open={open} onClose={() => { }} className={"relative z-50"}>
            <div className="fixed inset-0 flex w-screen items-center justify-center bg-neutral-900/40 p-4">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.0, opacity: 1 }} transition={{ duration: 0.15 }}>
                    <DialogPanel className="max-w-lg space-y-0 border border-1 border-neutral-700 shadow-2xl shadow-neutral-700 rounded-xl bg-neutral-900 p-0">
                        <DialogTitle className="flex flex-row items-center space-x-2 text-sm border-b border-1 border-neutral-700 font-semibold bg-white/5 rounded-t-xl px-4 py-2">
                            <FaPencil size={12} />
                            <span>{title}</span>
                        </DialogTitle>
                        {content}
                    </DialogPanel>
                </motion.div>
            </div>
        </Dialog >
    )
}