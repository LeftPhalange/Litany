import SubtaskDialog from "@/app/components/dialogs/subtaskDialog";
import { Subtask, SubtaskState, SubtaskType } from "@/app/types/subtask";

export default function AddSubtask({ onClick, closeDialog, open }: { onClick: (subtask: Subtask) => void, closeDialog: () => void, open: boolean }) {
    const defaultSubtask = {
        subtaskId: -1,
        userId: "",
        parentTaskId: 0,
        rowPositionIndex: 0,
        title: "",
        type: SubtaskType.Manual,
        state: SubtaskState.Complete,
        duration: 1
    }; // default subtask to pass into generic subtask dialog
    return (
        <SubtaskDialog
            subtask={defaultSubtask} title={"Add subtask"} onClick={onClick} closeDialog={closeDialog} open={open}
        />
    );
}