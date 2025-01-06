import SubtaskNode from "./subtaskNode";
import { Subtask } from "@/app/types/subtask";
import { Reorder, useDragControls } from "motion/react";
import { SupabaseClient } from "@supabase/supabase-js";

export default function MoveableSubtaskNode({ client, subtask, position, positionIndex, movable }: {client: SupabaseClient, subtask: Subtask, position: number, positionIndex: number, movable: boolean }) {
    const controls = useDragControls();
    
    return (
        <Reorder.Item value={position} dragListener={false} dragControls={controls}>
            <SubtaskNode client={client} subtask={subtask} positionIndex={positionIndex} controls={controls} movable={movable} />
        </Reorder.Item>
    );
}