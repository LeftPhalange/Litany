/* Label type definition and colors */

export enum LabelColor {
    Red = "bg-red-700",
    Green = "bg-green-700",
    Blue = "bg-sky-700",
    Purple = "bg-purple-700",
    Orange = "bg-orange-700",
    Neutral = "bg-neutral-700"
};

export type Label = {
    title: string,
    color: LabelColor
};