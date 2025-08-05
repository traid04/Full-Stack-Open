import React from "react";
import { TextField, MenuItem } from '@mui/material';

interface Props {
    checkValue: string;
    setCheck: React.Dispatch<React.SetStateAction<string>>;
}

const HealthForm : React.FC<Props> = ( { checkValue, setCheck } )=> {
    return(
        <>
            <TextField
                select
                label="Healthcheck rating"
                value={checkValue}
                onChange={(e) => setCheck(e.target.value)}
                fullWidth
            >
                <MenuItem value="0">0</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
            </TextField>
        </>
    )
}

export default HealthForm;