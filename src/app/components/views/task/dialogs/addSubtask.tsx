import DialogBox from "@/app/components/generic/dialog";
import { SubtaskType } from "@/app/types/task";
import { Button, Field, Fieldset, Input, Label, Select } from "@headlessui/react";
import { useState } from "react";

export default function AddSubtask({ onClick, closeDialog, open }: { onClick: (subtaskTitle: string, subtaskType: SubtaskType) => void, closeDialog: () => void, open: boolean }) {
    const title = "Create a new subtask"; // dialog title
    const maxTitleLength = 64;

    /* States for each field */
    const [subtaskTitle, setSubtaskTitle] = useState("");
    const [subtaskType, setSubtaskType] = useState(SubtaskType.Manual); // manual is default

    /* Status message for toast */
    const [statusMessage, setStatusMessage] = useState("");

    const addSubtask = (e: React.KeyboardEvent<HTMLFieldSetElement> | null) => {
        if (e && e.key != "Enter") { return; }
        setStatusMessage("");
        if (subtaskTitle.length > maxTitleLength) {
            setStatusMessage("Subtask title is too long (more than 64 characters). Please try again.");
        } else if (subtaskTitle.trim().length == 0) {
            setStatusMessage("Subtask title cannot be empty. Please try again.");
        } else {
            onClick(subtaskTitle, subtaskType);
            closeDialog();
        }
    };

    /* Fieldset to pass to generic Dialog component */
    const fieldSet = (
        <Fieldset onKeyUp={(e) => addSubtask(e)} className="space-y-4 p-6">
            {statusMessage.length > 0 ? <span className="text-sm">⚠️ {statusMessage}</span> : <></>}
            <Field className="flex flex-col">
                <Label className="block text-xs font-medium">Subtask title</Label>
                <Input maxLength={maxTitleLength} onChange={(e) => setSubtaskTitle(e.target.value)} className="mt-1 block bg-white/10 py-1 pl-2 text-xs rounded-lg border border-1 border-neutral-700" name="task-title" />
            </Field>
            <Field className="flex flex-col space-y-2">
                <Label className="block text-xs font-medium">Type</Label>
                <Select onChange={(e) => setSubtaskType(e.target.value as SubtaskType)} className="mt-1 block bg-white/10 py-1 pl-2 text-xs rounded-lg border border-1 border-neutral-700" name="task-type">
                    <option value={SubtaskType.Manual}>Manual</option>
                    <option value={SubtaskType.Timed}>Timed</option>
                    <option value={SubtaskType.Sequence}>Sequence</option>
                </Select>
            </Field>
            <div className="flex flex-row space-x-2 pt-2 w-full">
                <Button onClick={() => addSubtask(null)} className="bg-neutral-800 hover:bg-neutral-700 border border-1 border-neutral-600 rounded-lg py-2 px-8 font-semibold text-xs">Create</Button>
                <Button onClick={() => closeDialog()} className="bg-neutral-900 hover:bg-neutral-800 border border-1 border-neutral-600 rounded-lg py-2 px-8 font-semibold text-xs">Cancel</Button>
            </div>
        </Fieldset>
    );
    return (
        <DialogBox title={title} content={fieldSet} open={open} />
    )
}