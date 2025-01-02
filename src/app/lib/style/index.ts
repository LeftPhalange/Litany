import { BorderColor } from "@/app/types/border";
import { LabelColor } from "@/app/types/label";
import { SubtaskType } from "@/app/types/task";

/* Styling functions for client-side components */

export function getColorByType(type: SubtaskType): string {
    const colorMap: Record<SubtaskType, string> = {
        manual: `${LabelColor.Blue}`,
        timed: `${LabelColor.Orange}`,
        sequence: `${LabelColor.Purple}`,
        none: `${LabelColor.Neutral}`
    };

    return colorMap[type] || `bg-${LabelColor.Green}`;
}

export function getColorByPriority(type: string, border: boolean): string {
    const colorMap: Record<string, string> = {
        low: border ? BorderColor.Blue : LabelColor.Blue,
        medium: border ? BorderColor.Orange : LabelColor.Orange,
        high: border ? BorderColor.Red : LabelColor.Red,
    };

    return colorMap[type] || LabelColor.Neutral; // default to neutral if type is unrecognized
}