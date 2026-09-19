"use client";

import {useEffect, useState} from "react";

// todo: start defining component props types like this maybe??
type NotificationProps = {
    message: string;
    isVisible: boolean;
    progressIsRendered?: boolean;
    time: number;
};

// component adapted from: https://github.com/MichaelRFaria/CommitQuest/blob/main/frontend/src/components/sub/Notification.jsx
export default function Notification({
                                         message,
                                         isVisible,
                                         progressIsRendered,
                                         time
                                     }: NotificationProps) {
    const [progress, setProgress] = useState(0);

    // handles animating the progress bar indicating the timeout of the notification
    useEffect(() => {
        if (!isVisible) {
            setProgress(0);
            return;
        }

        const startTime = performance.now();
        let animationFrame: number;

        const update = (now: number) => {
            const elapsed = now - startTime;
            const percentage = Math.min((elapsed / time) * 100, 100);

            setProgress(percentage);

            // while the progress bar is not full, request another update before next browser repaint
            if (percentage < 100) {
                animationFrame = requestAnimationFrame(update);
            }
        };

        // request update call on next frame, before browser repaint
        animationFrame = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [isVisible, time]);

    return (
        // styling adapted from: https://github.com/MichaelRFaria/CommitQuest/blob/main/frontend/src/styles/Notification.css
        <div
            className={`
                fixed top-4 right-4 
                w-[min(300px,calc(100vw-2rem))]
                rounded-2xl border border-gray-600
                bg-[#282c34] p-4
                font-bold text-white
                shadow-lg
                transition-all duration-500 ease-in-out
                ${isVisible ? "translate-x-0 opacity-100 cursor-pointer"
                : "translate-x-[calc(100vw+1rem)] opacity-0 pointer-events-none"
                }`
            }
        >
            <p className="mb-2 break-words">
                {message}
            </p>

            {progressIsRendered && (
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                    <div
                        className="h-full rounded-full bg-green-600 transition-none"
                        style={{width: `${progress}%`}}
                    />
                </div>
            )}
        </div>
    );
}