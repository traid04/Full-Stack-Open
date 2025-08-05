import patientsEntries from "../../data/patients";
import { v1 as uuid } from "uuid";
import {
  Patient,
  PatientWithoutSsn,
  NewPatientEntry,
  NewEntry,
} from "../types";
import data from "../../data/patients";

const getPatients = (): PatientWithoutSsn[] => {
  const patients: Patient[] = patientsEntries;
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    })
  );
};

const addPatient = (object: NewPatientEntry): Patient => {
  const newPatient = {
    id: uuid(),
    name: object.name,
    dateOfBirth: object.dateOfBirth,
    ssn: object.ssn,
    gender: object.gender,
    occupation: object.occupation,
    entries: object.entries,
  };
  patientsEntries.push(newPatient);
  return newPatient;
};

const searchPatient = (id: string): Patient | null => {
  const patient: Patient | undefined = patientsEntries.find(
    (patient) => id === patient.id
  );
  if (patient !== undefined) {
    return patient;
  }
  return null;
};

const addEntry = (id: string, entry: NewEntry) => {
  const patient: Patient | null = searchPatient(id);
  if (patient) {
    let entryId = uuid();
    data.forEach((patient) => {
      if (patient.id === id) {
        patient.entries = patient.entries.concat({
          id: entryId,
          ...entry,
        });
      }
    });
    return {
      id: entryId,
      ...entry,
    };
  }
  return null;
};

export default { getPatients, addPatient, searchPatient, addEntry };
