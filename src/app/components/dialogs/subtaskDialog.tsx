import DialogBox from "@/app/components/generic/dialog";
import { getTimeFromSeconds } from "@/app/lib/timer";
import { Subtask, SubtaskState, SubtaskType } from "@/app/types/subtask";
import { Button, Field, Fieldset, Input, Label, Select } from "@headlessui/react";
import { useState } from "react";

/* Generic subtask dialog shared between AddSubtask and EditSubtask */

type SubtaskDuration = {
    hours: number,
    minutes: number,
    seconds: number
};

export default function SubtaskDialog({ subtask, title, onClick, closeDialog, open }: {
    subtask: Subtask,
    title: string,
    onClick: (subtask: Subtask) => void,
    closeDialog: () => void,
    open: boolean
}) {
    const maxTitleLength = 64;

    /* States for each field */
    const [statusMessage, setStatusMessage] = useState("");
    const [subtaskTitle, setSubtaskTitle] = useState(subtask.subtaskId <= -1 ? "" : subtask.title);
    const [subtaskType, setSubtaskType] = useState(subtask.subtaskId <= -1 ? SubtaskType.Manual : subtask.type); // manual is default
    const [timerDuration, setTimerDuration] = useState<SubtaskDuration>(subtask.duration ?
        getTimeFromSeconds(subtask.duration) : {
            hours: 0,
            minutes: 0,
            seconds: 1
        }); // in seconds

    const totalSeconds = (timerDuration.hours * (60 * 60)) + (timerDuration.minutes * 60) + timerDuration.seconds;

    const updateTimerDuration = (hours: number, minutes: number, seconds: number) => {
        const newDuration: SubtaskDuration = {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
        setTimerDuration(newDuration);
    }

    const addOrUpdateSubtask = (e: React.KeyboardEvent<HTMLFieldSetElement> | null) => {
        if (e && e.key != "Enter") { return; }
        setStatusMessage("");
        if (subtaskTitle.length > maxTitleLength) {
            setStatusMessage("Subtask title is too long (more than 64 characters). Please try again.");
        } else if (subtaskTitle.trim().length == 0) {
            setStatusMessage("Subtask title cannot be empty. Please try again.");
        } else {
            const editTask = subtask.subtaskId > -1;
            if (editTask) {
                const updatedSubtask: Subtask = {
                    subtaskId: subtask.subtaskId,
                    parentTaskId: subtask.parentTaskId,
                    userId: subtask.userId,
                    title: subtaskTitle,
                    type: subtaskType,
                    duration: subtask.type == SubtaskType.Timed ? totalSeconds : undefined,
                    state: subtask.state,
                    rowPositionIndex: subtask.rowPositionIndex
                };
                onClick(updatedSubtask);
            } else {
                const subtask: Subtask = {
                    subtaskId: -1, // not populated into addSubtask
                    parentTaskId: -1, // not populated into addSubtask
                    userId: "", // not populated into addSubtask
                    title: subtaskTitle,
                    type: subtaskType,
                    duration: subtaskType == SubtaskType.Timed ? totalSeconds : undefined,
                    state: SubtaskState.Incomplete, // not populated into addSubtask
                    rowPositionIndex: 0 // not populated into addSubtask
                };
                onClick(subtask);
            }
            closeDialog();
        }
    };
    const timedFields = (
        <Field className="flex flex-col space-y-2">
            <Label className="block text-xs font-semibold">Timer duration</Label>
            <Label className="block text-xs font-normal">⚠️ Note that changes may not take effect until you reset the timer.</Label>
            <div className="flex flex-col space-y-1">
                <Label className="block text-xs font-medium">Hours</Label>
                <Input
                    className="block text-sm bg-neutral-700 pl-2"
                    type="number"
                    onChange={(e) => updateTimerDuration(e.target.valueAsNumber, timerDuration.minutes, timerDuration.seconds)}
                    min="0"
                    max="23"
                    value={timerDuration.hours}
                />
            </div>
            <div className="flex flex-col space-y-1">
                <Label className="block text-xs font-medium">Minutes</Label>
                <Input
                    className="block text-sm bg-neutral-700 pl-2"
                    type="number"
                    onChange={(e) => updateTimerDuration(timerDuration.hours, e.target.valueAsNumber, timerDuration.seconds)}
                    min="0"
                    max="59"
                    value={timerDuration.minutes}
                />
            </div>
            <div className="flex flex-col space-y-1">
                <Label className="block text-xs font-medium">Seconds</Label>
                <Input
                    className="block text-sm bg-neutral-700 pl-2"
                    type="number"
                    onChange={(e) => updateTimerDuration(timerDuration.hours, timerDuration.minutes, e.target.valueAsNumber)}
                    min={ timerDuration.hours > 0 || timerDuration.minutes > 0 ? "0" : "1" }
                    max="59"
                    value={timerDuration.seconds}
                />
            </div>
        </Field>
    );

    /* Fieldset to pass to generic Dialog component */
    const fieldSet = (
        <Fieldset onKeyUp={(e) => addOrUpdateSubtask(e)} className="space-y-4 p-6">
            {statusMessage.length > 0 ? <span className="text-sm">⚠️ {statusMessage}</span> : <></>}
            <Field className="flex flex-col">
                <Label className="block text-xs font-medium">Subtask title</Label>
                <Input value={subtaskTitle} maxLength={maxTitleLength} onChange={(e) => setSubtaskTitle(e.target.value)} className="mt-1 block bg-white/10 py-1 pl-2 text-xs rounded-lg border border-1 border-neutral-700" name="subtask-title" />
            </Field>
            <Field className="flex flex-col space-y-2">
                <Label className="block text-xs font-medium">Type</Label>
                <Select value={subtaskType} onChange={(e) => setSubtaskType(e.target.value as SubtaskType)} className="mt-1 block bg-white/10 py-1 pl-2 text-xs rounded-lg border border-1 border-neutral-700" name="subtask-type">
                    <option value={SubtaskType.Manual}>Manual</option>
                    <option value={SubtaskType.Timed}>Timed</option>
                </Select>
            </Field>
            {subtaskType == SubtaskType.Timed && timedFields}
            <div className="flex flex-row space-x-2 pt-2 w-full">
                <Button onClick={() => addOrUpdateSubtask(null)} className="bg-neutral-800 hover:bg-neutral-700 border border-1 border-neutral-600 rounded-lg py-2 px-8 font-semibold text-xs">{subtask.subtaskId <= -1 ? "Create" : "Update"}</Button>
                <Button onClick={() => closeDialog()} className="bg-neutral-900 hover:bg-neutral-800 border border-1 border-neutral-600 rounded-lg py-2 px-8 font-semibold text-xs">Cancel</Button>
            </div>
        </Fieldset>
    );
    return (
        <DialogBox title={title} content={fieldSet} open={open} />
    )
}