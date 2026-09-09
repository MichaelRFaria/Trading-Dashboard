export type NavbarLink = {
    text: string,
    location: string,
}

export type MetricFormat = "text" | "currency" | "gain" | "gainWithPercentage";

export type DashboardActiveSection = "dashboard" | "watchlist" | "trade" | "history" | "portfolio"

export type MessageType = "success" | "error"