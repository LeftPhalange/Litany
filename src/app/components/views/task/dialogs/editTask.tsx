import DialogBox from "@/app/components/generic/dialog";
import { Task, TaskPriority } from "@/app/types/task";
import { Button, Field, Fieldset, Input, Label, Select, Textarea } from "@headlessui/react";
import { useState } from "react";

export default function EditTask({ task, onClick, closeDialog, open }: { task: Task, onClick: (id: number, title: string, description: string, priority: TaskPriority) => void, closeDialog: () => void, open: boolean }) {
    const title = "Edit task"; // dialog title
    const maxTitleLength = 64; // max length for title
    const maxDescriptionLength = 128; // max length for description

    /* States for each field */
    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskPriority, setTaskPriority] = useState(task.priority);
    const [taskDescription, setTaskDescription] = useState(task.description);

    /* Status message for toast */
    const [statusMessage, setStatusMessage] = useState("");

    /* Fieldset to pass to generic Dialog component */
    const fieldSet = (
        <Fieldset className="space-y-4 p-6">
            {statusMessage.length > 0 ? <span className="text-sm">⚠️ {statusMessage}</span> : <></>}
            <Field className="flex flex-col">
                <Label className="block text-xs font-medium">Task title</Label>
                <Input maxLength={maxTitleLength} onChange={(e) => setTaskTitle(e.target.value)} value={taskTitle} className="mt-1 block bg-white/10 py-1 pl-2 text-xs rounded-lg border border-1 border-neutral-700" name="task-title" />
            </Field>
            <Field className="flex flex-col">
                <Label className="block text-xs font-medium">Task description</Label>
                <Textarea maxLength={maxDescriptionLength} onChange={(e) => setTaskDescription(e.target.value)} value={taskDescription} className="mt-1 block bg-white/10 py-1 pl-2 text-xs rounded-lg border border-1 border-neutral-700" name="task-title" />
            </Field>
            <Field className="flex flex-col space-y-2">
                <Label className="block text-xs font-medium">Priority</Label>
                <Select onChange={(e) => setTaskPriority(e.target.value as TaskPriority)} value={taskPriority} className="mt-1 block bg-white/10 py-1 pl-2 text-xs rounded-lg border border-1 border-neutral-700" name="task-type">
                    <option value={TaskPriority.Low}>Low</option>
                    <option value={TaskPriority.Medium}>Medium</option>
                    <option value={TaskPriority.High}>High</option>
                </Select>
            </Field>
            <div className="flex flex-row space-x-2 pt-2 w-full">
                <Button onClick={() => {
                    setStatusMessage("");
                    if (taskTitle.length > maxTitleLength) {
                        setStatusMessage("Task title is too long (more than 64 characters). Please try again.");
                    } else if (taskTitle.trim().length == 0) {
                        setStatusMessage("Task must have a title. Try again.");
                    } else if (taskDescription.length > maxDescriptionLength) {
                        setStatusMessage("Task description is too long (more than 128 characters). Please try again.");
                    } else {
                        onClick(task.taskId, taskTitle, taskDescription, taskPriority);
                        closeDialog();
                    }
                }} className="bg-neutral-800 hover:bg-neutral-700 border border-1 border-neutral-600 rounded-lg py-2 px-8 font-semibold text-xs">Update</Button>
                <Button onClick={() => closeDialog()} className="bg-neutral-900 hover:bg-neutral-800 border border-1 border-neutral-600 rounded-lg py-2 px-8 font-semibold text-xs">Cancel</Button>
            </div>
        </Fieldset>
    );
    return (
        <DialogBox title={title} content={fieldSet} open={open} />
    )
}