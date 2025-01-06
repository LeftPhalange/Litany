"use client";

import NavigationBar from "../components/views/navigation/navigationBar";
import NavigationPane from "../components/views/navigation/navigationPane";
import TaskView from "../components/views/task/taskPane";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { createClient } from "../lib/supabase/client";
import { useTasks } from "../lib/hooks";
import { User } from "@supabase/supabase-js";

export default function Dashboard({ user } : { user: User }) {
    /* States for dashboard */
    const [ navigationPaneOpened, setNavigationPaneOpened ] = useState<boolean>(false); // only for breakpoints smaller than medium in Tailwind
    const [taskIndex, setTaskIndex] = useState<number>(-1);

    const client = createClient();

    const userId: string = user.id;
    const { data, isLoading, error } = useTasks(userId, client);

    if (!data || error || isLoading) return <></>;

    // if no tasks were found, the only task was likely deleted and we can go back
    if (data!.length == 0 && taskIndex != -1) { setTaskIndex(-1); }
    
    // go back to the previous task if the last task in the list deleted
    if (taskIndex == data!.length) { setTaskIndex(taskIndex - 1); }

    return (
        <div className="flex flex-col h-screen">
            <NavigationBar setNavigationPaneOpened={setNavigationPaneOpened} navigationPaneOpened={navigationPaneOpened} />
            <Toaster toastOptions={{ className: "text-sm font-bold", duration: 2000 }} />
            <div className="flex flex-row h-full overflow-y-auto">
                <NavigationPane userId={userId} setTaskIndex={setTaskIndex} navigationPaneOpened={navigationPaneOpened} setNavigationPaneOpened={setNavigationPaneOpened} currentTaskIndex={taskIndex} />
                <TaskView navigationPaneOpened={navigationPaneOpened} user={user} task={data![taskIndex]} />
            </div>
        </div>
    );
}
