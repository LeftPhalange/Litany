import { SupabaseClient } from "@supabase/supabase-js";
import { TaskPriority } from "@/app/types/task";
import TaskDialog from "@/app/components/dialogs/taskDialog";

export default function AddTask({ addTask, closeDialog, open }: {
    client: SupabaseClient,
    addTask: (title: string, description: string, priority: TaskPriority) => void,
    closeDialog: () => void,
    open: boolean
}) {
    const defaultTask = {
        userId: "",
        taskId: -1,
        title: "",
        description: "",
        priority: TaskPriority.Low,
        subtasks: []
    }; // default task to pass into generic task dialog
    return (
        <TaskDialog
            task={defaultTask} title={"Add task"} onClick={addTask} closeDialog={closeDialog} open={open}
        />
    );
}