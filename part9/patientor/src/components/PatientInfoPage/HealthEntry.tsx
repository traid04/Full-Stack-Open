import { Diagnosis, HealthCheckEntry } from "../../types";
import React from 'react';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Props {
    entry: HealthCheckEntry;
    diagnoses: Diagnosis[];
}

const HealthEntry : React.FC<Props> = ({ entry, diagnoses }) => {
    let health;
    switch (entry.healthCheckRating) {
        case 0:
            health = <FavoriteIcon style={ { color: "green" } } />
            break
        case 1:
            health = <FavoriteIcon style={ { color: "yellow" } } />
            break
        case 2:
            health = <FavoriteIcon style={ { color: "orange" } } />
            break
        case 3:
            health = <FavoriteIcon style={ { color: "red" } } />
            break
    }
    return (
        <div style={ { border: "2px solid black", paddingLeft: "5px", marginBottom: "10px" } }>
            <p>{entry.date} <MedicalServicesIcon /></p>
            <p>{entry.description}</p>
            <p>{health}</p>
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

export default HealthEntry