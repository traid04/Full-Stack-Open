import express from "express";
import patientsServices from "../services/patientsServices";
import { NewPatientEntry } from "../types";
import { toNewPatientEntry, toNewEntry } from "../utils/utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.status(200).send(patientsServices.getPatients());
});

router.post("/", (req, res) => {
  try {
    const { name, occupation, ssn, dateOfBirth, gender, entries } = req.body;
    const newPatient: NewPatientEntry = toNewPatientEntry({
      name,
      occupation,
      ssn,
      dateOfBirth,
      gender,
      entries,
    });
    const addedPatient = patientsServices.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage: string = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(404).send(errorMessage);
  }
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const patient = patientsServices.searchPatient(id);
  if (patient) {
    return res.status(200).json(patient);
  }
  return res.status(404).send("Patient not found");
});

router.post("/:id/entries", (req, res) => {
  try {
    const id = req.params.id;
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientsServices.addEntry(id, newEntry);
    if (addedEntry) {
      return res.status(200).json(addedEntry);
    }
    return res.status(404).send("Patient not found");
  }
  catch(error: unknown) {
    let errorMessage = "Something went wrong. ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    return res.status(400).json({ error: errorMessage });
  }
});

export default router;
