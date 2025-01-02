/* Typing for tasks and subtasks */

export enum TaskPriority {
    Low = "low",
    Medium = "medium",
    High = "high",
    None = "none"
};

export enum SubtaskType {
    Manual = "manual",
    Timed = "timed",
    Sequence = "sequence",
    None = "none"
};

export enum SubtaskState {
    Complete = "complete",
    Incomplete = "incomplete"
};

export type Task = {
    taskId: number
    title: string,
    description: string,
    priority: TaskPriority,
    subtasks: Subtask[],
};

export type SubtaskParent = {
    parentTaskId: string,
    subtaskId?: string,
    type: string
};

export type Subtask = {
    subtaskId: number,
    parentTaskId: number,
    parentSubtaskId?: number,
    rowPositionIndex: number,
    title: string,
    type: SubtaskType,
    state: SubtaskState,
    nestedSubtasks: Subtask[]
};