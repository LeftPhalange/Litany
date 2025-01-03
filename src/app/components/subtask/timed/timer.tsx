import { useState } from "react";
import { AnimationPlaybackControls, motion, useAnimate } from "motion/react";
import { CgPlayButton, CgPlayPause } from "react-icons/cg";

export default function Timer({
    seconds,
    elapsed,
}: {
    seconds: number;
    elapsed: () => void;
}) {
    const [scope, animate] = useAnimate();
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [currentAnimation, setCurrentAnimation] = useState<AnimationPlaybackControls | null>(null);
    const [secondsRemaining, setSecondsRemaining] = useState<number>(seconds);
    // const [currentInterval, setCurrentInterval] = useState<NodeJS.Timeout | null>();

    setInterval(() => {
        if (isRunning) {
            setSecondsRemaining(secondsRemaining - 1);
        }
    }, 1000);

    const startTimer = () => {
        console.log("Timer started");

        // Start animation and track the playback controls
        const animation = animate(
            scope.current,
            { scaleX: 0 },
            { duration: secondsRemaining, ease: "linear", delay: 1.0 }
        );
        setCurrentAnimation(animation);
        setIsRunning(true);

        // When animation completes, trigger the elapsed callback and reset timer
        animation.then(() => {
            if (secondsRemaining <= 0) {
                elapsed();
                setIsRunning(false);
            }
            resetTimer();
        });
    };

    const stopTimer = () => {
        console.log("Timer paused");
        if (currentAnimation) {
            // Pause animation
            currentAnimation.pause();
        }

        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setSecondsRemaining(seconds);
        setCurrentAnimation(null);
    };

    return (
        <div className="flex flex-col space-y-0">
            <button
                className="inline p-2"
                onClick={() => {
                    if (isRunning) {
                        stopTimer();
                    } else {
                        startTimer();
                    }
                }}
            >
                {isRunning ? <CgPlayPause size={24} /> : <CgPlayButton size={24} />}
            </button>
            <div className="relative pb-4">
                <div className="absolute h-1 rounded-full bg-orange-900 w-full" />
                <motion.div
                    initial={{ scaleX: 1, transformOrigin: "0% 100%" }}
                    ref={scope}
                    className="absolute h-1 rounded-full bg-gradient-to-r from-orange-600 to-yellow-500 w-full"
                />
            </div>
            <span className="text-sm">{secondsRemaining} seconds remaining</span>
        </div>
    );
}