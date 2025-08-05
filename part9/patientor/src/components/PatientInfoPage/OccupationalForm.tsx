import React from "react";
import { Box, Typography, TextField } from '@mui/material';
import { SickLeave } from "../../types";

interface Props {
    sickLeave: SickLeave;
    setSickLeave: React.Dispatch<React.SetStateAction<SickLeave>>
    employerName: string;
    setEmployerName: React.Dispatch<React.SetStateAction<string>>
}

const OccupationalForm : React.FC<Props> = ( { sickLeave, setSickLeave, employerName, setEmployerName } )=> {
    return(
        <>
            <TextField
                label="Employer Name"
                fullWidth
                value={employerName}
                onChange={({ target }) =>
                    setEmployerName(target.value)
                }
                />
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Sick Leave
                </Typography>
                <TextField
                    label="Start Date"
                    type="date"
                    fullWidth
                    value={sickLeave.startDate}
                    InputLabelProps={{ shrink: true }}
                    onChange={({ target }) =>
                        setSickLeave({ ...sickLeave, startDate: target.value })
                    }
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={sickLeave.endDate}
                    onChange={({ target }) =>
                        setSickLeave({ ...sickLeave, endDate: target.value })
                    }
                />
            </Box>
        </>
    )
}

export default OccupationalForm;