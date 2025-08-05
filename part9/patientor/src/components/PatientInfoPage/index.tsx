import { useParams } from "react-router-dom";
import patientService from "../../services/patients"
import diagnosesService from "../../services/diagnoses"
import { Diagnosis, Patient, Discharge, SickLeave, NewEntry } from "../../types";
import React, { useEffect, useState } from "react";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import OccupationalEntry from "./OccupationalEntry";
import HealthEntry from "./HealthEntry";
import HospitalEntry from "./HospitalEntry";
import HealthForm from "./HealthForm";
import HospitalForm from "./HospitalForm";
import OccupationalForm from "./OccupationalForm";
import { MenuItem, TextField, Grid, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import axios from "axios";

const PatientInfoPage = () => {
    const { id } = useParams();
    const [patientFound, setPatientFound] = useState<Patient | null>(null);
    const [error, setError] = useState<string>('');
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [type, setType] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [specialist, setSpecialist] = useState<string>('');
    const [healthCheckRating, setHealthCheckRating] = useState<string>('');
    const [discharge, setDischarge] = useState<Discharge>({ date: '', criteria: '' });
    const [employerName, setEmployerName] = useState<string>('');
    const [sickLeave, setSickLeave] = useState<SickLeave>({ startDate: '', endDate: '' });
    const [newDiagnoses, setNewDiagnoses] = useState<Diagnosis[]>([]);
    const [diagnoseToAdd, setDiagnoseToAdd] = useState<string>('');
    const [formError, setFormError] = useState<string>('');

    useEffect(() => {
        const patient = patientService.getPatient(id);
        patient
            .then(result => setPatientFound(result))
            .catch(error => setError(error.response.data))
    }, [id]);

    useEffect(() => {
        const diagnosesArray = diagnosesService.getDiagnoses()
        diagnosesArray
            .then(result => setDiagnoses(result))
            .catch(error => console.log(error.response.data))
    }, [])

    const assertNever = (entry: never): never => {
        throw new Error(`Unhandled entry type: ${JSON.stringify(entry)}`);
    }

    const resetStates = () => {
        setDescription('');
        setDate('');
        setSpecialist('');
        setHealthCheckRating('');
        setDischarge({ date: '', criteria: '' });
        setEmployerName('');
        setSickLeave({ startDate: '', endDate: '' });
        setNewDiagnoses([]);
        setDiagnoseToAdd('');
    }

    const handleEntry = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!patientFound?.id) {
            return;
        }
        let newEntry : NewEntry;
        if (type === "HealthCheck") {
            newEntry = {
                description,
                date,
                specialist,
                type: "HealthCheck",
                healthCheckRating: Number(healthCheckRating)
            }
        }
        else if (type === "OccupationalHealthcare") {
            newEntry = {
                description,
                date,
                specialist,
                type: "OccupationalHealthcare",
                employerName,
                sickLeave
            }
        }
        else if (type === "Hospital") {
            newEntry = {
                description,
                date,
                specialist,
                type: "Hospital",
                discharge
            }
        }
        else {
            return;
        }
        if (newDiagnoses.length > 0) {
            newEntry.diagnosisCodes = newDiagnoses.map(d => d.code);
        }
        try {
            const entry = await patientService.addEntry(patientFound.id, newEntry);
            setPatientFound({...patientFound, entries: patientFound.entries.concat(entry)});
            resetStates();
        }
        catch(error: unknown) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Unknown Axios error";
                setFormError(message);
            }
            else if (error instanceof Error) {
                setFormError(error.message)
            }
            else {
                setFormError("An unknown error occurred");
            }
            setTimeout(() => {
                setFormError('');
            }, 3000)
        }
    }

    const handleAddDiagnosis = (e : React.SyntheticEvent): void => {
        e.preventDefault();
        const findDiagnose = diagnoses.find(d => d.code === diagnoseToAdd);
        if (!findDiagnose) {
            return;
        }
        if (newDiagnoses.some(d => d.code === diagnoseToAdd)) {
            return;
        }
        setNewDiagnoses(newDiagnoses.concat(findDiagnose));
        setDiagnoseToAdd('');
    }

    if (error === '' && patientFound) {
        const entries = patientFound.entries.map(entry => {
            switch (entry.type) {
                case "HealthCheck": {
                    return <HealthEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
                }
                case "OccupationalHealthcare": {
                    return <OccupationalEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
                }
                case "Hospital": {
                    return <HospitalEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
                }
                default: {
                    return assertNever(entry);
                }
            }
        })
        return (
            <div>
                <h2>{patientFound.name}
                    {
                        patientFound.gender === 'female' ? <FemaleIcon /> : patientFound.gender === 'male' ? <MaleIcon /> : <TransgenderIcon />
                    }
                </h2>
                <p>ssn: {patientFound.ssn}</p>
                <p>occupation: {patientFound.occupation}</p>

                {formError !== '' 
                && (
                    <div style={ { backgroundColor: "#F8D7DA", paddingTop: "20px", paddingBottom: "20px", color: "#721C24", marginBottom: "20px", paddingLeft: "15px"}}>
                        <ErrorIcon />
                        {formError}
                    </div>
                )}

                <TextField
                    select
                    label="Choose option"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    fullWidth
                    >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
                    <MenuItem value="Hospital">Hospital</MenuItem>
                    <MenuItem value="HealthCheck">Health Check</MenuItem>
                </TextField>

                {
                    type !== '' &&
                        <div style={ { paddingLeft: "5px", marginTop: "10px",marginBottom: "60px" } }>
                            <form onSubmit={handleEntry}>
                                <TextField
                                label="Description"
                                fullWidth 
                                value={description}
                                onChange={({ target }) => setDescription(target.value)}
                                />
                                <TextField
                                label="Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                value={date}
                                onChange={({ target }) => setDate(target.value)}
                                />
                                <TextField
                                label="Specialist"
                                fullWidth
                                value={specialist}
                                onChange={({ target }) => setSpecialist(target.value)}
                                />
                                {
                                    type === 'HealthCheck' ? <HealthForm checkValue={healthCheckRating} setCheck={setHealthCheckRating} /> : type === 'Hospital' ? <HospitalForm discharge={discharge} setDischarge={setDischarge} /> : type === "OccupationalHealthcare" ? <OccupationalForm sickLeave={sickLeave} setSickLeave={setSickLeave} employerName={employerName} setEmployerName={setEmployerName} /> : <></>
                                }
                                <TextField
                                select
                                label="Diagnosis Codes"
                                fullWidth
                                value={diagnoseToAdd}
                                onChange={({ target }) => setDiagnoseToAdd(target.value)}
                                >
                                    <MenuItem value=""></MenuItem>
                                    {diagnoses.map(diagnose => {
                                        return (
                                            <MenuItem key={diagnose.name} value={diagnose.code}>{diagnose.code}</MenuItem>
                                        )
                                    })}
                                </TextField>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleAddDiagnosis}
                                    disabled={!diagnoseToAdd || diagnoseToAdd === ''}
                                    style={ { marginBottom: "10px" } }
                                >
                                    Add Diagnose
                                </Button>
                                {
                                    newDiagnoses.length > 0 &&
                                    (
                                        <div style={ { border: "2px solid black", marginBottom: "10px" } }>
                                            <h3 style={ { paddingLeft: "10px" } }>
                                                Diagnoses to add:
                                            </h3>
                                            {newDiagnoses.map(diagnose => {
                                                return(
                                                    <p key={diagnose.code} style={ { paddingLeft: "10px" } }>{diagnose.code}</p>
                                                )
                                            })}
                                        </div>
                                    )
                                }

                                <Grid>
                                <Grid item>
                                    <Button
                                    color="secondary"
                                    variant="contained"
                                    style={{ float: "left" }}
                                    type="button"
                                    onClick={() => {
                                        setType('');
                                        resetStates();
                                    }}
                                    >
                                    Cancel
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                    style={{
                                        float: "right",
                                    }}
                                    type="submit"
                                    variant="contained"
                                    >
                                    Add
                                    </Button>
                                </Grid>
                                </Grid>
                            </form>
                    </div>
                }

                {entries.length === 0 ? <h2>No entries found</h2> 
                : 
                    (
                        <>
                            <h2>entries</h2>
                            {entries}
                        </>
                    )
                }
            </div>
        )
    }
    return (
        <>
            <h2 style={ { color: "red" } }>{error}</h2>
        </>
    )
};

export default PatientInfoPage;