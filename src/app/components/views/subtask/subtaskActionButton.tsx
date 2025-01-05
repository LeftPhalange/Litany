import { Subtask, SubtaskButton } from "@/app/types/subtask";
import { Button } from "@headlessui/react";

export default function SubtaskActionButton({ subtask, button }: {
    subtask: Subtask,
    button: SubtaskButton
}) {
    return (
        <Button
            className={`flex flex-row items-middle space-x-2 py-1 px-4 rounded-full border border-1 border-neutral-700 hover:bg-neutral-700 ${button.subclass}`}
            onClick={() => { if (button.onClick) { button.onClick(subtask); } }}
        >
            {button.icon}
            <span className="hidden sm:block text-sm">{button.title}</span>
        </Button>
    )
}