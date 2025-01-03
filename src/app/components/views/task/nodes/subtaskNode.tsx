import Label from "../ui/label";
import toast from "react-hot-toast";
import { Subtask, SubtaskType } from "@/app/types/task";
import { getColorByType } from "@/app/lib/style";
import { CgCheckO, CgMathPlus, CgPlayButton, CgPlayPause, CgTrash, CgPen } from "react-icons/cg";
import { RiResetRightFill } from "react-icons/ri";
import { LabelColor } from "@/app/types/label";
import { deleteSubtask, updateManualSubtaskStatus } from "@/app/lib/data";
import { useSWRConfig } from "swr";
import { SupabaseClient } from "@supabase/supabase-js";
import { useSubtask } from "@/app/lib/hooks";
import { DragControls } from "motion/react";
import { MdDragHandle } from "react-icons/md";
import { PointerEvent } from "react";
import Timer from "@/app/components/subtask/timed/timer";

const buttonSize = 20;

export default function SubtaskNode({ client, subtask, positionIndex, controls, movable }: { client: SupabaseClient, subtask: Subtask, positionIndex: number, controls: DragControls | null, movable: boolean }) {
    const { mutate } = useSWRConfig();
    const { data, key, isLoading, error } = useSubtask(subtask.subtaskId, client);

    /* Do not render a whole subtask until it is fetched */
    if (error || subtask == undefined) { return <></> }
    if (isLoading) { return (<></>) }

    /* Button options for each type of subtask */
    const buttons = {
        check: {
            color: "text-white-600",
            title: "Complete task",
            icon: <CgCheckO className={data!.state == "complete" ? "text-green-600" : ""} size={buttonSize} />,
            onClick: (subtask: Subtask) => {
                const completed = data!.state == "complete";
                updateManualSubtaskStatus(client, subtask.subtaskId, !completed).then(() => {
                    mutate(key); // refetch data under key
                    toast.success(!completed ? "Subtask completed! Good work." : "Subtask progress has been reset.");
                });
            }
        },
        addSubtask: {
            color: "text-red-600",
            title: "Add subtask",
            icon: <CgMathPlus size={buttonSize} />,
            onClick: async (subtask: Subtask) => { console.log(`${subtask.subtaskId} not updated`); }
        },
        startTimer: {
            color: "text-orange-600",
            title: "Start timer",
            icon: <CgPlayButton size={buttonSize} />,
            onClick: async (subtask: Subtask) => { console.log("no update on " + subtask.subtaskId); }
        },
        pauseTimer: {
            color: "text-white",
            title: "Pause timer",
            icon: <CgPlayPause size={buttonSize} />,
            onClick: async (subtask: Subtask) => { console.log("no update on " + subtask.subtaskId); }
        },
        resetProgress: {
            color: "text-white",
            title: "Reset subtask",
            icon: <RiResetRightFill size={buttonSize} />,
            onClick: async (subtask: Subtask) => { console.log("no update on " + subtask.subtaskId); }
        },
        deleteSubtask: {
            color: "text-white",
            title: "Delete subtask",
            icon: <CgTrash size={buttonSize} />,
            onClick: (subtask: Subtask) => {
                deleteSubtask(client, subtask.subtaskId).then(() => {
                    mutate(`task-${subtask.parentTaskId}`); // seal the deal, mutation was made in the task
                    toast.success("Subtask deleted.");
                });
            }
        },
        editSubtask: {
            color: "text-white",
            title: "Edit subtask",
            icon: <CgPen size={buttonSize} />,
            onClick: async (subtask: Subtask) => { console.log("no update on " + subtask.subtaskId); }
        }
    }

    const options = {
        manual: [buttons.check, buttons.editSubtask, buttons.deleteSubtask],
        timed: [buttons.check, buttons.startTimer, buttons.pauseTimer, buttons.resetProgress, buttons.deleteSubtask],
        sequence: [buttons.check, buttons.addSubtask, buttons.deleteSubtask],
        none: []
    }

    function beginDrag(e: PointerEvent) {
        if (controls) { controls.start(e); }; // if not null, start drag
    }

    const labelColor = getColorByType(data!.type);
    const type: SubtaskType = data!.type;

    return (
        <div className={`flex flex-col py-4 transition-none border-r border-b ${positionIndex == 0 && "border-t"} border-neutral-600 bg-neutral-800`}>
            <div className="flex flex-row px-4">
                <div className="flex items-center pr-4">
                    {movable && <MdDragHandle size={24} onPointerDown={beginDrag} style={{ touchAction: "none" }} />}
                </div>
                <div className="flex flex-col w-full space-y-1">
                    <div className="flex flex-row space-x-2">
                        <Label title={data!.type} color={labelColor} />
                        {data!.state == "complete" && <Label title={`Completed`} color={`${LabelColor.Green}`} />}
                    </div>
                    <div className="flex flex-row select-none">
                        <div className="flex flex-col min-w-fit space-y-0">
                            <span className="text-md font-semibold">{data!.title}</span>
                            <span className="text-sm font-normal">{data!.state == "complete" ? "This subtask has been completed." : "No progress made yet."}</span>
                        </div>
                    </div>
                    {data!.type == "timed" && <Timer seconds={60} elapsed={() => {
                        updateManualSubtaskStatus(client, subtask.subtaskId, true).then(() => {
                            mutate(key);
                        });
                    }} />}
                </div>
                <div className="flex flex-row space-x-2 w-fit h-fit outline outline-1 outline-neutral-600 bg-black/20 rounded-full p-1 mr-2">
                    {options[type].map((button, index: number) =>
                        <button key={index} title={button.title} onClick={() => button.onClick(data!)} className={`hover:${button.color} p-2 rounded-full hover:bg-white/10 transition-all`}>
                            {button.icon}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
