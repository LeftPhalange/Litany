/* Typing for tasks */

import { Subtask } from "./subtask";

export enum TaskPriority {
    Low = "low",
    Medium = "medium",
    High = "high",
    None = "none"
};

export type Task = {
    userId: string,
    taskId: number
    title: string,
    description: string,
    priority: TaskPriority,
    subtasks: Subtask[],
};