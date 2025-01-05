import Label from "../ui/label";
import toast from "react-hot-toast";
import TimerSubview from "@/app/components/views/subtask/timed/timerSubview";
import ManualSubview from "@/app/components/views/subtask/manual/manualSubview";
import { getColorByType } from "@/app/lib/style";
import { CgCheckO, CgTrash, CgPen } from "react-icons/cg";
import { deleteSubtask, getSubtasksByParent, updateManualSubtaskStatus, updateSubtask } from "@/app/lib/data";
import { useSWRConfig } from "swr";
import { SupabaseClient } from "@supabase/supabase-js";
import { useSubtask } from "@/app/lib/hooks";
import { DragControls } from "motion/react";
import { MdDragHandle } from "react-icons/md";
import { JSX, PointerEvent, useState } from "react";
import { Subtask, SubtaskState, SubtaskType } from "@/app/types/subtask";
import { RiResetLeftLine } from "react-icons/ri";
import EditSubtask from "../../subtask/dialogs/editSubtask";

const buttonSize = 18;

export default function SubtaskNode({ client, subtask, positionIndex, controls, movable }: { client: SupabaseClient, subtask: Subtask, positionIndex: number, controls: DragControls | null, movable: boolean }) {
    const { mutate } = useSWRConfig();
    const { data, key, isLoading, error } = useSubtask(subtask.subtaskId, client);

    /* States for SubtaskNode */
    const [currentDialog, setCurrentDialog] = useState<JSX.Element | null>(null);

    /* Do not render a whole subtask until it is fetched */
    if (error || subtask == undefined) { return <></> }
    if (isLoading) { return (<></>) }

    const updateSubtaskPositioning = async () => {
        /* Fix positioning before deleting subtask for good */
        // TODO: figure out a more efficient way to do this, we're currently updating all subtasks instead of the relevant ones
        const subtasks = await getSubtasksByParent(client, subtask.parentTaskId);
        const filteredSubtasks = subtasks
            .filter((current) => current.subtaskId != subtask.subtaskId)
            .sort((a, b) => a.rowPositionIndex - b.rowPositionIndex);

        // Update row position indices for each subtask under parent
        filteredSubtasks.map(async (subtask: Subtask, index: number) => {
            subtask.rowPositionIndex = index;
            console.log("");
            await updateSubtask(client, subtask);
        });
    };

    /* Button options for each type of subtask */
    const buttons = {
        check: {
            subclass: "text-white-600",
            title: data!.state == "complete" ? "Reset progress" : "Complete subtask",
            icon: data!.state == "complete" ? <RiResetLeftLine size={buttonSize} /> : <CgCheckO size={buttonSize} />,
            onClick: (subtask: Subtask) => {
                const completed = data!.state == "complete";
                updateManualSubtaskStatus(client, subtask.subtaskId, !completed).then(() => {
                    mutate(key); // refetch data under key
                    toast.success(!completed ? "Subtask completed! Good work." : "Subtask progress has been reset.");
                });
            }
        },
        deleteSubtask: {
            subclass: "text-white",
            title: "Delete subtask",
            icon: <CgTrash size={buttonSize} />,
            onClick: async (subtask: Subtask) => {
                await updateSubtaskPositioning();
                await deleteSubtask(client, subtask.subtaskId).then(() => {
                    mutate(`task-${subtask.parentTaskId}`); // seal the deal, mutation was made in the task
                    toast.success("Subtask deleted.");
                });
            }
        },
        editSubtask: {
            subclass: "text-white",
            title: "Edit subtask",
            icon: <CgPen size={buttonSize} />,
            onClick: async () => {
                const dialog = (
                    <EditSubtask
                        client={client}
                        subtask={data!}
                        onClick={(subtask: Subtask) => {
                            updateSubtask(client, subtask).then(() => {
                                mutate(key);
                            });
                        }}
                        closeDialog={() => {
                            setCurrentDialog(null);
                        }}
                        open={!currentDialog}
                    />
                );
                setCurrentDialog(dialog);
            }
        }
    }

    const options = {
        manual: [buttons.check, buttons.editSubtask, buttons.deleteSubtask],
        timed: [buttons.editSubtask, buttons.deleteSubtask],
        none: []
    }

    function beginDrag(e: PointerEvent) {
        if (controls) { controls.start(e); }; // if not null, start drag
    }

    const labelColor = getColorByType(data!.type);
    const type: SubtaskType = data!.type;

    return (
        <div className={`flex flex-col py-4 transition-none border-r border-b ${positionIndex == 0 && "border-t"} border-neutral-600 bg-neutral-800`}>
            {currentDialog}
            <div className="flex flex-row px-4">
                <div className="flex items-center pr-4">
                    {movable && <MdDragHandle size={24} onPointerDown={beginDrag} style={{ touchAction: "none" }} />}
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex flex-row space-x-2">
                        <Label title={data!.type} color={labelColor} />
                        <Label title={data!.state} color={data!.state == SubtaskState.Complete ? "bg-green-600" : "bg-red-600"} />
                    </div>
                    <div className="flex flex-row select-none">
                        <div className="flex flex-col min-w-fit space-y-0">
                            <span className="text-md font-semibold pt-1">{data!.title}</span>
                            {type == "manual" &&
                                <span className="text-sm font-normal">
                                    {data!.state == "complete" ? "This subtask has been completed." : "No progress made yet."}
                                </span>
                            }
                        </div>
                    </div>
                    {type == "timed" && <TimerSubview subtask={data!} buttons={options.timed} toggleCompletion={() => { buttons.check.onClick(subtask); }} />}
                    {type == "manual" && <ManualSubview subtask={data!} buttons={options.manual} />}
                </div>
            </div>
        </div>
    )
}
