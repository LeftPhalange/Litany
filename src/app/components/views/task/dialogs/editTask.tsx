import TaskDialog from "@/app/components/dialogs/taskDialog";
import { Task, TaskPriority } from "@/app/types/task";

export default function EditTask({ task, onClick, closeDialog, open }: { task: Task, onClick: (title: string, description: string, priority: TaskPriority, id?: number) => void, closeDialog: () => void, open: boolean }) {
    return (
        <TaskDialog
            task={task} title={"Edit task"} onClick={onClick} closeDialog={closeDialog} open={open}
        />
    );
}