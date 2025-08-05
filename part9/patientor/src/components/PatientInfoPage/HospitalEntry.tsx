import { Diagnosis, HospitalEntry } from "../../types";
import React from 'react';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface Props {
    entry: HospitalEntry;
    diagnoses: Diagnosis[];
}

const HospitalPatientEntry: React.FC<Props> = ({ entry, diagnoses }) => {
    return (
        <div style={ { border: "2px solid black", paddingLeft: "5px", marginBottom: "10px" } }>
            <p>{entry.date} <LocalHospitalIcon /></p>
            <p>{entry.description}</p>
            <ul>
                {entry.diagnosisCodes?.map(d => {
                return (
                    <li key={d}>{d} {diagnoses.find(diagnose => diagnose.code === d)?.name}</li>
                )
                })}
            </ul>
            <p>diagnose by {entry.specialist}</p>
        </div>
    )
}

export default HospitalPatientEntry;