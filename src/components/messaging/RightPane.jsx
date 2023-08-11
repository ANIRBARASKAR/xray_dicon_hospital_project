import React, { useState, useEffect, useContext, useRef } from "react"

import { ConnectionsContext, ChatContext, PatientContext } from "./ContextProvider.js"
import NavActions from "../dicom/NavActions.jsx"
import Box from "@mui/system/Box"
import Button from "@mui/material/Button"
import SendIcon from '@mui/icons-material/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'

import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styled from 'styled-components';
import moment from 'moment';
// import { IconButton } from '@material-ui/core';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChatArea from './ChatArea.jsx'



export default function RightPane({ }) {
    let { ActiveConnectionId, getActiveConnection, getActiveConnectionMessages, addToChatMessages, sendMessage } = useContext(ChatContext)
    let { sendPatientMessage, getActivePatient } = useContext(PatientContext)
    let chatInputRef = useRef()
    let ActiveConnection = getActiveConnection()
    let ActivePatient = getActivePatient()


    function handleSendClick() {
        let messageString = chatInputRef.current.value;
        // let errors = sanatizeChatMessage(toSend);
        if (ActivePatient) {
            sendPatientMessage(messageString)
            chatInputRef.current.value = ''
        } else if (ActiveConnection) {
            sendMessage(messageString)
            chatInputRef.current.value = ''
        } else {
            alert('No chat selected!')
        }
        //change to 
    }

    return (
        <Box sx={{
            display: 'flex', width: 'fill-available', height: '-webkit-fill-available',
            flexDirection: 'column', bgcolor: 'white'
        }}>
          
            <NavActions sx={{
                width: '-webkit-fill-available',
                borderTop: '1px solid #535151',
                color: 'black'
            }}>
                <Box component={'div'} sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: '1rem'
                }}>

                    <div >
                        <Box component={'h3'} sx={{ marginBottom: 0, marginTop: '10px' }}>
                            {ActivePatient
                                ? 'Patient: ' + ActivePatient?.name
                                : 'General chat'}
                        </Box>
                    </div>
                </Box>
                <Box component={'p'} sx={{ margin: '10px' }}>{ActiveConnection?.email || 'Select chat...'}</Box>
            </NavActions>

            <ChatArea chats={getActiveConnectionMessages()} />

            <NavActions sx={{
                width: '-webkit-fill-available',
                borderTop: '1px solid #535151',
            }}>
                <FormControl sx={{ m: 1, width: '70%' }} variant="outlined">
                    <InputLabel size="small" htmlFor="outlined-adornment-password">enter message</InputLabel>
                    <OutlinedInput
                        inputRef={chatInputRef}
                        size="small"
                        id="outlined-adornment-password"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    edge="end"
                                >
                                    <AttachFileIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        label="enter message"
                    />

                </FormControl>


                <Button variant="contained"
                    sx={{ margin: 'auto' }}
                    endIcon={<SendIcon />}
                    onClick={handleSendClick}>
                    Send
                </Button>
            </NavActions>

        </Box>

    )
}
