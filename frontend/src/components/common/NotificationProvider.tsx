"use client";

import {createContext, type ReactNode, useCallback, useContext, useEffect, useState,} from "react";

import Notification from "@/src/components/common/Notification";

type Notification = {
    message: string;
    duration: number;
    progress: boolean;
};

type NotificationContextType = {
    showNotification: (
        message: string,
        duration?: number,
        progress?: boolean
    ) => void;
    hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({children}: { children: ReactNode; }) {
    const [notification, setNotification] = useState<Notification | null>(null);

    const showNotification = useCallback((
            message: string,
            duration: number = 5000,
            progress: boolean = false
        ) => {
            setNotification({
                message,
                duration,
                progress,
            });
        },
        []
    );

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    useEffect(() => {
        if (!notification) {
            return;
        }

        const timeout = setTimeout(() => {
            setNotification(null);
        }, notification.duration);

        return () => clearTimeout(timeout);
    }, [notification]);

    return (
        <NotificationContext.Provider
            value={{
                showNotification,
                hideNotification,
            }}
        >
            {children}

            <Notification
                message={notification?.message ?? ""}
                isVisible={notification !== null}
                progressIsRendered={notification?.progress ?? false}
                time={notification?.duration ?? 5000}
            />
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotification must be used inside a NotificationProvider"
        );
    }

    return context;
}