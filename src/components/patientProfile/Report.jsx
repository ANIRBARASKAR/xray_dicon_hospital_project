import React from "react"

export default function Report({ util }) {
    let { Data,navigate, setLoder}= util

    return (
        <>
            <img src={Data.report_data.path}/>
            {JSON.stringify(Data)}
        </>
    )
}