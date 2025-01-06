"use client";

import PaneNode from "./paneNode";
import TaskPaneNode from "./taskPaneNode";
import { Task, TaskPriority } from "@/app/types/task";
import { Dispatch, JSX, SetStateAction, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { useTasks } from "@/app/lib/hooks";
import { addTask } from "@/app/lib/data";
import AddTask from "./dialogs/addTask";
import { useSWRConfig } from "swr";

export default function NavigationPane({ userId, currentTaskIndex, setTaskIndex, navigationPaneOpened, setNavigationPaneOpened }: {
    userId: string,
    currentTaskIndex: number,
    setTaskIndex: Dispatch<SetStateAction<number>>,
    navigationPaneOpened: boolean,
    setNavigationPaneOpened: Dispatch<SetStateAction<boolean>>
}) {
    const client = createClient();
    const { mutate } = useSWRConfig();
    const { data, key } = useTasks(userId, client);

    /* States for navigation pane */
    const [currentDialog, setCurrentDialog] = useState<JSX.Element | null>(null);

    if (!data) return <></>
    const actions = [
        {
            key: "add-task",
            title: "➕ Add a task",
            color: "border-purple-600",
            onClick: () => {
                const dialog = <AddTask client={client} addTask={(title: string, description: string, priority: TaskPriority) => {
                    addTask (client, userId, title, description, priority).then(async () => {
                        mutate(key).then(() => setTaskIndex(data!.length));
                    });
                }} closeDialog={() => {
                    setCurrentDialog(null);
                    mutate(key);
                }} open={true} />
                setCurrentDialog(dialog);
            }
        }
    ]
    return (
        <div className={`${!navigationPaneOpened ? "hidden md:flex" : "flex w-full md:w-fit"} flex-col border-r border-neutral-700 bg-neutral-900/80 h-full min-w-6xl`}>
            {currentDialog}
            <PaneNode title={"🏡 Home"} color={"border-sky-600"} selected={currentTaskIndex == -1} onClick={() => { setTaskIndex(-1); setNavigationPaneOpened(false); }} />
            {/* TODO: For the span subheadings, they will need to be put into a generic "label" component limited to the navigation pane */}
            <span className="pt-4 pb-2 pl-4 text-xs font-medium uppercase">Actions</span>
            {actions.map((action) => <PaneNode key={action.key} title={action.title} color={action.color} selected={false} onClick={action.onClick} />)}
            <span className="pt-4 pb-2 pl-4 text-xs font-medium uppercase">Tasks</span>
            {data!.map((task: Task, index: number) =>
                <TaskPaneNode task={task} key={task.title} selected={index == currentTaskIndex} onClick={() => {
                    if (index != currentTaskIndex) {
                        setTaskIndex(index);
                    }
                    setNavigationPaneOpened(false);
                }} />)
            }
        </div>
    );
}