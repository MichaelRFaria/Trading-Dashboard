import {useState} from "react";

export default function Metrics({holdingsData}) {
    return (
        <>
            <div className="flex flex-col items-center">
                <p>Portfolio Value:</p>
                <p>Today's Gain/Loss:</p>
                <p>Total Gain/Loss:</p>
                <p>Largest Position</p>
                <p>Number of Holdings:</p>
            </div>
        </>
    )
}