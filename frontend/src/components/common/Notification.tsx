'use client';

import { useEffect, useState } from 'react';

// todo: start defining component props types like this maybe??
type NotificationProps = {
  message: string;
  isVisible: boolean;
  progressIsRendered?: boolean;
  time: number;
  onDismiss: () => void;
};

// component adapted from: https://github.com/MichaelRFaria/CommitQuest/blob/main/frontend/src/components/sub/Notification.jsx
export default function Notification({
  message,
  isVisible,
  progressIsRendered,
  time,
  onDismiss,
}: NotificationProps) {
  const [progress, setProgress] = useState(0);
  const [displayedMessage, setDisplayedMessage] = useState(message);

  // Keep the last message mounted while the notification slides out.
  useEffect(() => {
    if (message) {
      setDisplayedMessage(message);
    }
  }, [message]);

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
    <button
      type="button"
      onClick={onDismiss}
      className={`
                fixed top-4 right-4 
                w-[min(300px,calc(100vw-2rem))]
                rounded-2xl border border-white/10
                bg-slate-900/90 p-4
                text-left font-semibold text-white
                shadow-2xl shadow-black/30 backdrop-blur
                transition-all duration-500 ease-in-out
                ${
                  isVisible
                    ? 'translate-x-0 opacity-100 cursor-pointer'
                    : 'translate-x-[calc(100vw+1rem)] opacity-0 pointer-events-none'
                }`}
    >
      <p className="mb-2 wrap-break-word">{displayedMessage}</p>

      {progressIsRendered && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-sky-400 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  );
}
