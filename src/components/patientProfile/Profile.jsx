import React, { useState, useEffect } from "react"
import Appointment from './Appointment.jsx'

export default function Profile({ util }) {
    let { navigate, MetaData, setLoder } = util
    let [Patient, setPatient] = useState([])

    useEffect(() => {
        electron.db.getPatient(MetaData.patient._id)
            .then(patientsData => {
                // console.log(patientsData)
                setPatient(patientsData.resp.patient)
            })
    },[])



    return (  
        <>
            {JSON.stringify(Patient)}
            {Patient.appointments?.map(Data => {
                return <Appointment util={{ Data, navigate, setLoder }} />
            })}
            <button onClick={() => { navigate('Back') }}>back</button>
        </>
    )
}