import { Subtask, SubtaskState, SubtaskType } from "@/app/types/subtask";
import { Task, TaskPriority } from "@/app/types/task";
import { SupabaseClient } from "@supabase/supabase-js";

/* Helper functions that capture data from tables in Supabase */

export async function updateManualSubtaskStatus(client: SupabaseClient, subtaskId: number, complete: boolean) {
    const { error } = await client
        .from("subtasks")
        .update({ state: complete ? "complete" : "incomplete" })
        .eq('id', subtaskId);
    return !error;
}

export async function getSubtask(client: SupabaseClient, subtaskId: number): Promise<Subtask> {
    const { data } = await client
        .from("subtasks")
        .select()
        .eq('id', subtaskId)
        .single();

    return {
        subtaskId: data.id,
        parentTaskId: data.parent_task_id,
        title: data.title,
        type: data.type,
        state: data.state,
        duration: data.duration,
        rowPositionIndex: data.row_position_index
    };
}

export async function getTasks(client: SupabaseClient, userId: number): Promise<Task[]> {
    const { data } = await client
        .from("tasks")
        .select("*")
        .order('id', { ascending: true })
        .eq('user_id', userId);

    return await Promise.all(data!.map(async (task) => {
        return {
            taskId: task.id,
            title: task.title,
            description: task.task_description,
            priority: task.priority,
            subtasks: (await getSubtasksByParent(client, task.id as number))!
        };
    }));
}

export async function addTask(client: SupabaseClient, userId: number, title: string, description: string, priority: TaskPriority): Promise<Task> {
    const task: Task = {
        taskId: -1, // change this with ID found in the response
        title: title,
        description: description,
        priority: priority,
        subtasks: []
    };

    const { data } = await client
        .from("tasks")
        .insert({
            user_id: userId,
            title: task.title,
            task_description: task.description,
            priority: task.priority,
            subtask_ids: []
        })
        .select("id")
        .single();

    task.taskId = data!.id;
    return task;
}

export async function updateSubtask(client: SupabaseClient, subtask: Subtask): Promise<boolean> {
    const res = await client
        .from("subtasks")
        .update({
            title: subtask.title,
            type: subtask.type,
            duration: subtask.duration,
            row_position_index: subtask.rowPositionIndex
        })
        .eq("id", subtask.subtaskId);

    return !res.error;
}

export async function updateSubtaskRowPosition(client: SupabaseClient, id: number, rowPositionIndex: number): Promise<boolean> {
    const res = await client
        .from("subtasks")
        .update({
            row_position_index: rowPositionIndex
        })
        .eq("id", id)

    return !res.error;
}

export async function updateTask(client: SupabaseClient, id: number, title: string, description: string, priority: TaskPriority): Promise<boolean> {
    const res = await client
        .from("tasks")
        .update({
            title: title,
            task_description: description,
            priority: priority
        })
        .eq("id", id)

    return !res.error;
}

export async function addSubtask(client: SupabaseClient, parentTaskId: number, title: string, type: SubtaskType, state: SubtaskState, rowPositionIndex: number, duration?: number): Promise<Subtask> {
    const subtask: Subtask = {
        subtaskId: -1, // change this with ID found in response
        title: title,
        type: type,
        state: state,
        parentTaskId: parentTaskId,
        rowPositionIndex: rowPositionIndex
    };

    const { data } = await client
        .from("subtasks")
        .insert({
            parent_task_id: parentTaskId,
            title: title,
            type: type,
            state: state,
            duration: duration,
            row_position_index: rowPositionIndex
        })
        .select()
        .single();

    subtask.subtaskId = data!.id;

    // add duration to subtask object if it is timed
    if (subtask.type == SubtaskType.Timed) {
        subtask.duration = duration;
    }
    return subtask;
}

export async function deleteSubtask(client: SupabaseClient, subtaskId: number): Promise<boolean> {
    return deleteFromTable(client, "subtasks", subtaskId);
}

export async function deleteTask(client: SupabaseClient, taskId: number): Promise<boolean> {
    // delete task then associated subtasks under parent task ID
    const [deleteTaskRes, deleteSubtasksRes] = await Promise.all([
        deleteFromTable(client, "tasks", taskId),
        deleteSubtasksUnderTask(client, taskId)
    ]);
    return deleteTaskRes && deleteSubtasksRes;
}

export async function deleteSubtasksUnderTask(client: SupabaseClient, id: number): Promise<boolean> {
    const res = await client
        .from("subtasks")
        .delete()
        .eq("parent_task_id", id);

    return !res.error;
}

export async function deleteFromTable(client: SupabaseClient, tableName: string, id: number): Promise<boolean> {
    const res = await client
        .from(tableName)
        .delete()
        .eq("id", id);

    return !res.error;
}

export async function getTask(client: SupabaseClient, taskId: number): Promise<Task> {
    const { data } = await client
        .from("tasks")
        .select("*")
        .eq('id', taskId)
        .single();

    return {
        taskId: data.id,
        title: data.title,
        description: data!.task_description,
        priority: data!.priority,
        subtasks: await getSubtasksByParent(client, data.id as number)
    }
}

export async function getSubtasksByParent(client: SupabaseClient, taskId: number): Promise<Subtask[]> {
    const { data, error, status } = await client
        .from("subtasks")
        .select("*")
        .order('id', { ascending: true })
        .eq('parent_task_id', taskId);

    if (error && status !== 406) {
        console.log(error)
        throw error
    }

    return await Promise.all(data!.map((subtask) => {
        return {
            subtaskId: subtask.id,
            parentTaskId: subtask.parent_task_id,
            title: subtask.title,
            type: subtask.type,
            state: subtask.state,
            rowPositionIndex: subtask.row_position_index
        }
    }));
}