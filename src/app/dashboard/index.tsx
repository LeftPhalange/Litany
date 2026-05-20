"use client";

import NavigationBar from "../components/views/navigation/navigationBar";
import NavigationPane from "../components/views/navigation/navigationPane";
import TaskView from "../components/views/task/taskPane";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { createClient } from "../lib/supabase/client";
import { useTasks } from "../lib/hooks";
import { User } from "@supabase/supabase-js";

const PANE_MIN_WIDTH = 160;
const PANE_MAX_WIDTH = 480;
const PANE_DEFAULT_WIDTH = 256;

export default function Dashboard({ user } : { user: User }) {
    /* States for dashboard */
    const [ navigationPaneOpened, setNavigationPaneOpened ] = useState<boolean>(false); // only for breakpoints smaller than medium in Tailwind
    const [taskIndex, setTaskIndex] = useState<number>(-1);
    const [paneWidth, setPaneWidth] = useState<number>(PANE_DEFAULT_WIDTH);
    const isResizing = useRef<boolean>(false);

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

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return;
            setPaneWidth(Math.min(Math.max(e.clientX, PANE_MIN_WIDTH), PANE_MAX_WIDTH));
        };
        const onMouseUp = () => { isResizing.current = false; };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    if (!data || error || isLoading) return <></>;

    return (
        <div className="flex flex-col h-screen">
            <NavigationBar setNavigationPaneOpened={setNavigationPaneOpened} navigationPaneOpened={navigationPaneOpened} />
            <Toaster toastOptions={{ className: "text-sm font-bold", duration: 2000 }} />
            <div className="flex flex-row h-full overflow-y-auto">
                <NavigationPane paneWidth={paneWidth} userId={userId} setTaskIndex={setTaskIndex} navigationPaneOpened={navigationPaneOpened} setNavigationPaneOpened={setNavigationPaneOpened} currentTaskIndex={taskIndex} />
                <div
                    onMouseDown={() => { isResizing.current = true; }}
                    className="hidden md:block w-1 flex-shrink-0 cursor-col-resize bg-neutral-700 hover:bg-sky-500 active:bg-sky-400 transition-colors"
                />
                <TaskView navigationPaneOpened={navigationPaneOpened} user={user} task={data![taskIndex]} />
            </div>
        </div>
    );
}
