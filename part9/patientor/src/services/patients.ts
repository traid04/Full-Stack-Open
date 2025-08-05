import axios from "axios";
import { NewEntry, Patient, PatientFormValues, Entry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const getPatient = async (id: string | undefined) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);

  return data;
};

const addEntry = async (id: string, entry: NewEntry): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    entry
  );
  return data;
};

export default {
  getAll,
  create,
  getPatient,
  addEntry,
};
