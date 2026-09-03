import HoldingsList from "@/src/components/HoldingsList";

export default function Portfolio({holdingsData}) {
    return (
        <div className="flex flex-col justify-center items-center">
            <HoldingsList holdingsData={holdingsData}/>
        </div>)
}