import SubtaskActionButton from "../subtaskActionButton";
import { AnimationPlaybackControls, motion, useAnimate } from "motion/react";
import { getTimeFromSeconds, useTimer } from "@/app/lib/timer";
import { useEffect, useRef, useState } from "react";
import { Subtask, SubtaskButton, SubtaskState } from "@/app/types/subtask";
import { CgPlayButton, CgPlayPause } from "react-icons/cg";
import { RiResetRightFill } from "react-icons/ri";

export default function TimerSubview({
    subtask,
    buttons,
    toggleCompletion,
}: {
    subtask: Subtask,
    buttons: SubtaskButton[],
    toggleCompletion: () => void;
}) {

    /* Button attributes */
    const buttonIconSize = 18;

    const seconds = subtask!.duration ?? 1;

    /* States and refs for timer */
    const [scope, animate] = useAnimate();
    const [hasTimerStarted, setTimerStarted] = useState<boolean>(false);
    const [hasTimerCompleted, setTimerCompleted] = useState<boolean>(false);
    const { remainingSeconds, isRunning, startTimer, stopTimer, resetTimer } = useTimer(seconds);
    const animateRef = useRef<AnimationPlaybackControls | null>(null);

    // non-state variables that can help indicate conditions for each button
    const hasTimerFinished = remainingSeconds == 0;
    const subtaskCompleted = subtask.state == SubtaskState.Complete || hasTimerFinished;
    const canResetProgress = (subtaskCompleted || ((!hasTimerStarted && !isRunning) && remainingSeconds != seconds));
    const canToggleTimer = !subtaskCompleted;

    const formatTime = (remainingSeconds: number) => {
        const { hours, minutes, seconds } = getTimeFromSeconds(remainingSeconds);

        let timeString = "";

        if (hours > 0) {
            const unit = hours == 1 ? "hour" : "hours";
            timeString += `${hours} ${unit}, `;
        }

        if (minutes > 0) {
            const unit = minutes == 1 ? "minute" : "minutes";
            timeString += `${minutes} ${unit}, `;
        }

        if (seconds > 0) {
            const unit = seconds == 1 ? "second" : "seconds";
            timeString += `${seconds} ${unit} remaining`;
        }

        return timeString;
    };

    const timerButtonDef = {
        toggleTimer: {
            subclass: canToggleTimer ? "text-white" : "text-neutral-400 hover:cursor-not-allowed",
            title: isRunning ? "Pause timer" : "Start timer",
            icon: isRunning ? <CgPlayPause size={buttonIconSize} /> : <CgPlayButton size={buttonIconSize} />,
            onClick: async () => {
                // start timer
                if (!hasTimerStarted && subtask.state == SubtaskState.Incomplete) {
                    // set timer started state, start timer in hook
                    setTimerStarted(true);
                    startTimer();
                }

                // pause animation and timer
                if (isRunning) {
                    setTimerStarted(false);
                    if (animateRef.current) {
                        animateRef.current.pause();
                    }
                    stopTimer();
                }
            }
        },
        resetProgress: {
            subclass: canResetProgress ? "text-white" : "text-neutral-400 hover:cursor-not-allowed",
            title: "Reset timer",
            icon: <RiResetRightFill size={buttonIconSize} />,
            onClick: canResetProgress ? (async () => {
                if (animateRef.current) {
                    animateRef.current = null;
                    animateRef.current = animate(scope.current, { scaleX: "100%" }, { duration: 2, delay: 0 }); // bring progress bar back up to full scale
                }

                if (subtaskCompleted) {
                    toggleCompletion(); // reset progress
                }

                // set states back to false state
                setTimerCompleted(false);
                setTimerStarted(false);

                // set remaining seconds back
                resetTimer();
            }) : () => { }
        },
    };

    const timerButtons: SubtaskButton[] = [timerButtonDef.toggleTimer, timerButtonDef.resetProgress];

    useEffect(() => {
        if (hasTimerStarted && !hasTimerFinished) {
            // start or continue animation after pause
            animateRef.current = animate(scope.current, { scaleX: "0%" }, { duration: remainingSeconds, delay: 0 });
        }
        if (hasTimerFinished && !hasTimerCompleted) {
            // stop timer, set hook status back to not running
            stopTimer();

            // toggle completion within subview
            toggleCompletion();
            setTimerCompleted(true);
        }
    }, [hasTimerStarted, hasTimerFinished, hasTimerCompleted, animate, scope, remainingSeconds, startTimer, toggleCompletion, stopTimer]);

    return (
        <div className="flex flex-col space-y-0">
            <span className="inline text-sm pb-2 select-none">{subtaskCompleted ? "This subtask has been completed." : formatTime(remainingSeconds)}</span>
            <div className="relative py-2">
                <div className="absolute h-1 rounded-full bg-orange-900 w-full" />
                <motion.div
                    initial={{ scaleX: "100%", transformOrigin: "0% 100%" }}
                    ref={scope}
                    className="absolute h-1 rounded-full bg-gradient-to-r from-orange-600 to-yellow-500 w-full"
                />
            </div>
            <div className="flex flex-row py-2 space-x-2">
                {timerButtons.map((button) =>
                    <SubtaskActionButton key={button.title} button={button} subtask={subtask} />
                )}
                {buttons.map((button: SubtaskButton) =>
                    <SubtaskActionButton key={button.title} button={button} subtask={subtask} />
                )}
            </div>
        </div>
    );
}
