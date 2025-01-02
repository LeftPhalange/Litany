import { createClient } from "@/app/lib/supabase/client";
import PaneNode from "./paneNode";
import { useTask } from "@/app/lib/hooks";
import { getColorByPriority } from "@/app/lib/style";
import { Task } from "@/app/types/task";

export default function TaskPaneNode({ task, selected, onClick }: { task: Task, selected: boolean, onClick: () => void }) {
    const client = createClient();
    const { data } = useTask(task.taskId, client);

    return data ?
        <PaneNode color={getColorByPriority(data!.priority, true)} title={data!.title} selected={selected} onClick={onClick} /> :
        <PaneNode color={getColorByPriority(task.priority, true)} title={task.title} selected={selected} onClick={onClick} />;
}
