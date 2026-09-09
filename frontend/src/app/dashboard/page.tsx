"use client"

import Sidebar from "@/src/components/layout/Sidebar";
import Header from "@/src/components/layout/Header";
import DashboardSection from "@/src/components/layout/DashboardSection";
import {act, useEffect, useState} from "react";
import {DashboardActiveSection} from "@/src/types/misc";

export default function DashboardPage() {
    const [activeSection, setActiveSection] = useState<DashboardActiveSection>("dashboard")

    useEffect(() => {
        console.log("active section changed to: " + activeSection)
    }, [activeSection]);

    return (
        <div className="grid grid-cols-[240px_1fr] grid-rows-[70px_1fr] h-screen w-screen">
            <aside className="col-start-1 col-span-1 row-start-2 row-span-1"><Sidebar setActiveSection={setActiveSection}/></aside>
            <header className="col-start-1 col-span-2 row-start-1 row-span-1"><Header/></header>
            <main className="col-start-2 col-span-1 row-start-2 row-span-2"><DashboardSection activeSection={activeSection}/></main>
        </div>
    )
}