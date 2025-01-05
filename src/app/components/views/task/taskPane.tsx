import Label from "./ui/label";
import Button from "@/app/components/generic/button";
import AddSubtask from "./dialogs/addSubtask";
import EditTask from "./dialogs/editTask";
import toast from "react-hot-toast";
import DeleteTask from "./dialogs/deleteTask";
import MoveableSubtaskNode from "./nodes/moveableSubtaskNode";
import SubtaskNode from "./nodes/subtaskNode";
import { JSX, useState } from "react";
import { addSubtask, deleteTask, updateSubtaskRowPosition, updateTask } from "@/app/lib/data";
import { createClient } from "@/app/lib/supabase/client";
import { useTask } from "@/app/lib/hooks";
import { useSWRConfig } from "swr";
import { Reorder } from "motion/react";
import { getColorByPriority } from "@/app/lib/style";
import { CgArrowsV, CgCheck, CgMathPlus, CgPen, CgTrash } from "react-icons/cg";
import { Task, TaskPriority } from "../../../types/task";
import { SubtaskState, SubtaskType } from "@/app/types/subtask";

export default function TaskPane({ task, navigationPaneOpened }: { task?: Task, navigationPaneOpened: boolean }) {
    return (
        <main className={`${navigationPaneOpened ? "hidden md:inline" : "inline"} bg-neutral-900 w-full h-full`}>
            {task ? <TaskView task={task} /> : <HomePage />}
        </main>
    )
}

function HomePage() {
    return (
        <div className="flex">
            <div className="flex flex-row space-x-4 p-8">
                <div className="flex flex-col space-y-0">
                    <span className="text-xl font-bold">Welcome to Litany</span>
                    <span className="text-sm font-regular">Please choose a task to the left, or you can create one under Actions.</span>
                </div>
            </div>
        </div>
    );
}

function TaskView({ task }: { task: Task }) {
    const client = createClient();
    const { mutate } = useSWRConfig();

    /* States for TaskView */
    const [currentDialog, setCurrentDialog] = useState<JSX.Element | null>(null);
    const [rowsMovable, setRowsMovable] = useState<boolean>(false);
    const [subtaskPositions, setSubtaskPositions] = useState<number[]>([]); // orders each subtask with its own index

    const { data, key, error, isLoading } = useTask(task.taskId, client);

    if (!data || error || isLoading) { return (<></>) }

    // initialize subtask positions state 
    if (data && data.subtasks.length != subtaskPositions.length) {
        setSubtaskPositions(data.subtasks.map((subtask) => subtask.rowPositionIndex));
    }

    const subtasksExist = subtaskPositions.length > 0;

    // TODO: create component for ActionButton
    const buttons = [
        {
            text: "Add a subtask",
            icon: <CgMathPlus size={16} />,
            disabled: false,
            onClick: () => {
                setCurrentDialog(<AddSubtask open={true} onClick={async (subtaskTitle: string, subtaskType: SubtaskType) => {
                    addSubtask(client, data!.taskId, subtaskTitle, subtaskType, SubtaskState.Incomplete, data!.subtasks.length).then(() => {
                        mutate(key);
                        toast.success("Subtask added.");
                    });
                }} closeDialog={() => setCurrentDialog(null)} />)
            }
        },
        {
            text: "Edit this task",
            icon: <CgPen size={16} />,
            disabled: false,
            onClick: () => {
                setCurrentDialog(<EditTask task={data!} open={true} onClick={(id: number, title: string, description: string, priority: TaskPriority) => {
                    updateTask(client, id, title, description, priority).then(() => {
                        mutate(key);
                        toast.success("Task edited.");
                    });
                }} closeDialog={() => setCurrentDialog(null)} />)
            }
        },
        {
            text: rowsMovable ? "Done" : "Move subtasks",
            icon: (!rowsMovable ? <CgArrowsV size={16} /> : <CgCheck size={16} />),
            disabled: !subtasksExist || subtaskPositions.length == 1,
            onClick: () => {
                // if rows are no longer movable after change state, save all row positions
                setRowsMovable(!rowsMovable);
                if (rowsMovable) {
                    subtaskPositions.map((position, i) => updateSubtaskRowPosition(client, data!.subtasks[i].subtaskId, position));
                    mutate(key);
                }
            }
        },
        {
            text: "Delete this task",
            icon: <CgTrash size={16} />,
            disabled: false,
            onClick: () => {
                setCurrentDialog(<DeleteTask deleteTask={() => deleteTask(client, task.taskId).then(() => {
                    mutate("tasks");
                    setCurrentDialog(null);
                })}
                    closeDialog={() => { setCurrentDialog(null); }} />);
            }
        }
    ]

    // NOTE: we're switching between subtask node and moveable subtask node in order to prevent transformations taking place during navigation, thanks to Reorder.Item in Motion
    const subtaskGroup = subtasksExist ? (
        <Reorder.Group axis="y" values={subtaskPositions} onReorder={setSubtaskPositions}>
            {
                // NOTE: position is the index that is assigned to each subtask in the grid
                // position is also the index we extract the data from, but the positionIndex is merely positional for the grid and it is a linear 0, 1, 2, 3...
                // assign key not linearly but by position as well or it will behave unexpectedly (index number keys in map are discouraged by React docs too, so subtask IDs from DB are used)
                subtaskPositions.map((position, positionIndex) =>
                    rowsMovable ?
                        <MoveableSubtaskNode
                            key={position}
                            client={client}
                            subtask={data.subtasks[position]}
                            position={position}
                            positionIndex={positionIndex}
                            movable={rowsMovable}
                        /> :
                        <SubtaskNode
                            key={positionIndex}
                            client={client} subtask={data.subtasks[position]}
                            positionIndex={positionIndex}
                            controls={null}
                            movable={false}
                        />
                )
            }
        </Reorder.Group>
    ) : <></>;

    return (
        <div className="flex flex-col space-y-1 overflow-y-scroll h-full">
            {currentDialog}
            <div className="flex flex-col space-y-1 pt-8 px-8">
                <Label title={data!.priority} color={getColorByPriority(data!.priority, false)} />
                <div className="flex flex-col space-y-0">
                    <span className="text-xl font-bold">{data!.title}</span>
                    <span className="text-sm font-light">{data!.description}</span>
                </div>
                <div className="flex flex-row space-x-2 w-full py-2">
                    {buttons.map((button) => <Button key={button.text} disabled={button.disabled} icon={button.icon} text={button.text} onClick={button.onClick} />)}
                </div>
            </div>
            <div className="flex flex-col">
                {!subtasksExist ?
                    <span className="text-md px-8">No subtasks have been made yet.</span> : subtaskGroup
                }
            </div>
        </div>
    );
}