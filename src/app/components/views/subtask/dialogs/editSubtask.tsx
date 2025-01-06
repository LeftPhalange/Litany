import SubtaskDialog from "@/app/components/dialogs/subtaskDialog";
import { Subtask } from "@/app/types/subtask";

export default function EditSubtask({ subtask, onClick, closeDialog, open }: {
    subtask: Subtask,
    onClick: (subtask: Subtask) => void,
    closeDialog: () => void,
    open: boolean
}) {
    return (
        <SubtaskDialog subtask={subtask} title="Edit subtask" onClick={onClick} closeDialog={closeDialog} open={open} />
    );
}