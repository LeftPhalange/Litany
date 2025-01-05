import { Subtask, SubtaskButton } from "@/app/types/subtask";
import SubtaskActionButton from "../subtaskActionButton";

export default function ManualSubview({ subtask, buttons }: {
    subtask: Subtask,
    buttons: SubtaskButton[]
}) {
    // TODO: serialize SubtaskActionButton mapping (or key for each) with something different than the index
    return (
        <div className="flex flex-row py-2 space-x-2">
            {buttons.map((button: SubtaskButton, index: number) =>
                <SubtaskActionButton key={index.toString()} button={button} subtask={subtask} />
            )}
        </div>
    )
}