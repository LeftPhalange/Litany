"use client";

import NavigationBar from "../components/views/navigation/navigationBar";
import NavigationPane from "../components/views/navigation/navigationPane";
import TaskView from "../components/views/task/taskPane";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { createClient } from "../lib/supabase/client";
import { useTasks } from "../lib/hooks";
import { User } from "@supabase/supabase-js";

export default function Dashboard({ user } : { user: User }) {
    /* States for dashboard */
    const [ navigationPaneOpened, setNavigationPaneOpened ] = useState<boolean>(false); // only for breakpoints smaller than medium in Tailwind
    const [taskIndex, setTaskIndex] = useState<number>(-1);

    const client = useMemo(() => createClient(), []);

    const userId: string = user.id;
    const { data, isLoading, error } = useTasks(userId, client);

    useEffect(() => {
        if (!data) return;
        if (data.length === 0 && taskIndex !== -1) {
            setTaskIndex(-1);
        } else if (taskIndex === data.length) {
            setTaskIndex(taskIndex - 1);
        }
    }, [data, taskIndex]);

    if (!data || error || isLoading) return <></>;

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
