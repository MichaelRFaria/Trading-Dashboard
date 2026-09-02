"use client"

import React from "react";

export default function Sidebar({setActiveSection}) {

    const logout = () => {
        //window.location.href = "http://localhost:8080/logout";
        // point to logout endpoint or change to whatever logout flow
    }

    return (
        <aside className="opactity-90 bg-gray">
            <div className="flex flex-col">
                <button onClick={() => setActiveSection("dashboard")}>Dashboard</button>
                <button onClick={() => setActiveSection("portfolio")}>Portfolio</button>
                <button onClick={() => setActiveSection("watchlist")}>Watchlist</button>
                <button onClick={() => setActiveSection("trade")}>Trade</button>
                <button onClick={() => setActiveSection("history")}>History</button>
            </div>
            <hr/>
            <div className="flex flex-col">
                <button>Settings</button>
                <button onClick={logout}>Log Out</button>
            </div>
        </aside>
    )
}