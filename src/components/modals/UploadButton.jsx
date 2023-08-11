import * as React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function ({ util, multiple }) {

    let { onFileChange } = util

    let [len,setLen] = React.useState(0); // number of files uploaded

    function handleFileChange(e){
        onFileChange(e)
        setLen(e.target.files.length)
    }

    return (
        <Box component='div' sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxHeight:'50vh',
            margin:'auto'
        }}>
            <Button sx={{}} variant="contained" component="label">
                <CloudUploadIcon sx={{ pr: '1rem' }} />
                Upload
                <input hidden type="file" multiple={multiple} accept=".png,.jpg,.jpeg,.dcm,.tiff"
                    onChange={(e) => { handleFileChange(e) }} />
            </Button>

            {`Uploaded ${len} documents`} 
        </Box>
    )
}