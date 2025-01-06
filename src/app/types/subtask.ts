import { JSX } from "react";

export type SubtaskButton = {
    subclass: string, // subclass is within a Tailwind class that indicates color, style, etc
    title: string,
    icon: JSX.Element,
    onClick?: (subtask: Subtask) => void | Promise<void> | (() => void)
}

export type SubtaskParent = {
    parentTaskId: string,
    subtaskId?: string,
    type: string
};

export type Subtask = {
    subtaskId: number,
    userId: string,
    parentTaskId: number,
    rowPositionIndex: number,
    title: string,
    type: SubtaskType,
    state: SubtaskState,
    duration?: number
};

export enum SubtaskType {
    Manual = "manual",
    Timed = "timed",
    None = "none"
};

export enum SubtaskState {
    Complete = "complete",
    Incomplete = "incomplete"
};