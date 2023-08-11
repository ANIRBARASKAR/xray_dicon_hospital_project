import React, { useContext, useState, useRef } from 'react'
import AddAppointment from '../modals/AddAppointment.jsx'
import {DataContext} from './ContextProvider.js';


export default function Modal({ util }){
    let {  setLoder } = util
    let {AddAppointmentModalPatientId, closeAddAppointmentModal, openAddAppointmentModal}=useContext(DataContext)

    return(
        <AddAppointment util={{
            patientId: AddAppointmentModalPatientId,
            AddAppointmentModal: AddAppointmentModalPatientId!=undefined,
            closeAddAppointmentModal, setLoder
        }} />

    )
}