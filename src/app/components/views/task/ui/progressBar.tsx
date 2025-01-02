import { motion } from "motion/react";

export default function ProgressBar({ percentage }: { percentage: number }) {
    return (
        <div className="relative pb-4">
            <div
                className={`absolute h-1 rounded-full bg-orange-900 w-full justify-left`}
            />
            <motion.div
                initial={{ scaleX: "0%", transformOrigin: "0% 100%" }}
                animate={{ scaleX: `${percentage}%`}}
                exit={{ opacity: 0 }}
                transition={{ duration: 10.0, delay: 0.5 }}
                className={`absolute h-1 rounded-full bg-gradient-to-r from-orange-600 to-yellow-500 w-full justify-left`}
            />
        </div>
    );
}