import DialogBox from "@/app/components/generic/dialog"
import { Description, Button } from "@headlessui/react";

export default function DeleteTask({ deleteTask, closeDialog }: { deleteTask: () => void, closeDialog: () => void }) {
    const content = (
        <div className="flex flex-col p-4">
            <Description className="pb-4">
                <span className="text-sm">
                    This will remove the task you&#39;re on. Continue?
                </span>
            </Description>
            <div className="flex flex-row space-x-4 justify-center pb-2">
                <Button onClick={() => deleteTask()} className="bg-neutral-800 hover:bg-neutral-700 border border-1 border-neutral-600 rounded-lg py-2 px-8 font-semibold text-xs">Delete</Button>
                <Button onClick={() => closeDialog()} className="bg-neutral-900 hover:bg-neutral-800 border border-1 border-neutral-600 rounded-lg py-2 px-8 font-semibold text-xs">Cancel</Button>
            </div>
        </div>
    );
    return (
        <DialogBox title={"Are you sure?"} content={content} open={true} />
    )
}