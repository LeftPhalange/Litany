import { useRef, useState } from "react";

/* Utils for timer */

/* Custom hook that implements setInterval as a timer */
export function useTimer(seconds: number) {
    const [remainingSeconds, setRemainingSeconds] = useState<number>(seconds);
    const [isRunning, setIsRunning] = useState<boolean>();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setRemainingSeconds((prevSeconds) => {
                    if (prevSeconds > 0) {
                        return prevSeconds - 1;
                    } else {
                        if (isRunning) {
                            stopTimer();
                        }
                        return 0; // Ensure it doesn't go negative
                    }
                });
            }, 1000);
        }
    };

    const stopTimer = () => {
        if (isRunning) {
            setIsRunning(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    };

    const resetTimer = () => {
        setIsRunning(false);
        stopTimer();

        // start timer again with remaining seconds reset
        setRemainingSeconds(seconds);
    };

    return {
        remainingSeconds: remainingSeconds,
        isRunning: isRunning,
        startTimer: startTimer,
        stopTimer: stopTimer,
        resetTimer: resetTimer
    }
}

/* Get time in hours, minutes, and seconds */

export function getTimeFromSeconds(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingAfterHours = totalSeconds % 3600;

    const minutes = Math.floor(remainingAfterHours / 60);
    const seconds = remainingAfterHours % 60;
    
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}