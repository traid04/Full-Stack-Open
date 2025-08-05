import { Diagnosis, OccupationalHealthcareEntry } from "../../types";
import React from 'react';
import WorkIcon from '@mui/icons-material/Work';

interface Props {
    entry: OccupationalHealthcareEntry;
    diagnoses: Diagnosis[];
}

const OccupationalEntry: React.FC<Props> = ({ entry, diagnoses }) => {
    return (
        <div style={ { border: "2px solid black", paddingLeft: "5px", marginBottom: "10px" } }>
            <p>{entry.date} <WorkIcon /> {entry.employerName}</p>
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

export default OccupationalEntry;