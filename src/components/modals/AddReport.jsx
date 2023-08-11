//? unstable one

import * as React from 'react';

import UploadButton from './UploadButton.jsx'
import Box from '@mui/material/Box';


import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';


export default function FormDialog({ util }) {

    // console.log(util)
    let { closeAddReportModal, addReportModal, patientId, appointmentId } = util

    const handleClose = () => {
        closeAddReportModal();
    };

    let [Patient, setPatient] = useState({})
    let [Appointment, setAppointment] = useState({})
    let report = { }

    useEffect(async () => {
        const patientData = await electron.db.getPatient(patientId)
        if (patientData.objectNotFound || !patientData.resp.patient) {
            console.error(patientData);
            return;
        }
        const appointment = getAppointment(appointmentId, patientData.resp.patient)
        if (!appointment) {
            console.error(patientData, 'no appointment found for id: ',appointmentId);
            return;
        }
        setPatient(patientData.resp.patient)
        setAppointment(appointment)

    })

    function getAppointment(appointmentId, patient){
        let ans = false;
        patient.appointments.forEach(appointment => {
            ans = appointmentId==appointment._id && appointment
        });
        return ans;
    }

    function onFileChange(event) {

        // Update the state
        const fileList = event.target.files; // type is fileList , not normal array
        // console.log(fileList)

        const element = fileList.item(0);
        reportFile = {
            path: element.path,
            name: element.name,
            mimeType: element.type
        }


    };

    function uploadReportFile() {
        let resp = electron.fileHandler.upload(reportFile)
        // console.log(resp)
        if (!resp.fileUploaded) {
            console.error(resp)
            return;
        }
        file.path = resp.resp.file.path
        report = {

            report_data: {
                report_type: file.type.indexOf('image/') !=-1 ? 'image' : 'dicom',
                label: file.name,
                sub_label: "img sub label",
                path: file.path
            }
        }

    }


    function addReport() {

        let timestamp = {
            created_at: Date.now(),
            last_modified: Date.now(),
        }

        report.timestamp = timestamp
        report._id = appointmentId + '-' + Appointment.reports.length

        // setLoder(true)
        uploadReportFile()

        // console.log(JSON.stringify(appointment))
        electron.db.editPatient(patientId, Patient)
            .then(res => {
                // console.log(res)
                if (res.objectEdited) {
                    alert('added')
                    closeAddReportModal()
                } else {
                    window.alert(res.error.instancePath + ' ' + res.error.message)
                }
                // setLoder(false)
            }).catch(e => {
                // setLoder(false)

            })
    }

    function inputReportData(field, value) {
        // console.log(appointment, field, value)
        appointment[field] = value
    }

    return (
        <div>
            <Modal open={addReportModal} onClose={handleClose}
            >
                <Box sx={{ bgcolor: 'primary.light', ...sx }}>
                    <Typography
                        sx={{ mx: 'auto', my: '1rem', textAlign: 'center', color: 'primary.main' }}
                    >NEW REPORT DETAILS
                        {Patient && Appointment ? `for Appointment:${Appointment.timestamp.created_at} patient: ${Patient.name}`
                            : `no valid appointment found for given patientId: ${patientId} and appointmentId: ${appointmentId}`}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Box component={'div'} sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '69.8%',
                            justifyContent: 'space-between'
                        }}>

                            <TextField sx={{ m: '1rem' }} type="text" label="notes" variant="standard" fullWidth required
                                onInput={(e) => { inputReportData('notes', e.target.value) }} />

                        </Box>

                        <UploadButton util={{ onFileChange }} />

                    </Box>
                    <Button variant='contained' onClick={() => { addReport() }}
                        sx={{ mx: 'auto', my: '1rem' }}>
                        <AddIcon sx={{ pr: '1rem' }} />Add Report</Button>
                </Box>
            </Modal>
        </div >
    );
}

const sx = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column'
};