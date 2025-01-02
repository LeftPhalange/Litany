/* Reusable useSWR hooks (i.e. useSubtask, useTask, useUser, etc...), client-side only */

"use client";

import useSWR from "swr"
import { getSubtask, getTask, getTasks } from "../data"
import { SupabaseClient } from "@supabase/supabase-js";

/* Reusable client-side hooks based on useSWR for subtasks, tasks, etc */

export function useSubtask(id: number, client: SupabaseClient) {
    const key = `subtask-${id}`;
    const { data, error, isLoading } = useSWR(key, () => getSubtask(client, id));

    return {
        data: data,
        key: key,
        isLoading,
        error: error
    };
}

export function useTask(id: number, client: SupabaseClient) {
    const key = `task-${id}`;
    const { data, error, isLoading } = useSWR(key, () => getTask(client, id));

    return {
        data: data,
        key: key,
        isLoading,
        error: error
    };
}

export function useTasks (userId: number, client: SupabaseClient) {
    const key = "tasks";
    const { data, error, isLoading } = useSWR(key, () => getTasks(client, userId));

    return {
        data: data,
        key: key,
        isLoading,
        error: error
    };
}