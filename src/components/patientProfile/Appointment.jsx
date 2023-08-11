import React from "react"
import Report from './Report.jsx'

export default function Appointment({ util }) {
    let { Data,navigate, setLoder}= util

    return (
        <>
            {Data.reports.map(Data=>{
                return <Report util={{Data,navigate, setLoder}}/>
            })}
        </>
    )
}