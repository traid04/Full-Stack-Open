import React from "react";
import { Box, Typography, TextField } from '@mui/material';
import { Discharge } from "../../types";

interface Props {
    discharge: Discharge;
    setDischarge: React.Dispatch<React.SetStateAction<Discharge>>;
}

const HealthForm : React.FC<Props> = ( { discharge, setDischarge } )=> {
    return(
        <>
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Discharge
                </Typography>
                <TextField
                    label="Date"
                    type="date"
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    value={discharge.date}
                    onChange={({ target }) =>
                        setDischarge({ ...discharge, date: target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Criteria"
                    fullWidth
                    value={discharge.criteria}
                    onChange={({ target }) =>
                        setDischarge({ ...discharge, criteria: target.value })
                    }
                />
            </Box>
        </>
    )
}

export default HealthForm;