import Dashboard from "@/src/components/main_section/Dashboard";
import Portfolio from "@/src/components/main_section/Portfolio";
import Watchlist from "@/src/components/main_section/Watchlist";
import Trade from "@/src/components/main_section/Trade";
import History from "@/src/components/main_section/History";

export default function DashboardSection({activeSection}) {
    switch (activeSection) {
        case "dashboard":
            return <Dashboard/>
        case "portfolio":
            return <Portfolio/>
        case "watchlist":
            return <Watchlist/>
        case "trade":
            return <Trade/>
        case "history":
            return <History/>
    }
}