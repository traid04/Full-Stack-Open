import {
  NewPatientEntry,
  Gender,
  NewEntry,
  Diagnose,
  HealthCheckRating,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  Discharge,
  SickLeave,
} from "../types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const isHealthCheckRating = (
  str: string
): str is keyof typeof HealthCheckRating => {
  const keys = ["Healthy", "LowRisk", "HighRisk", "CriticalRisk"];
  return keys.includes(str);
};

const parseStrings = (str: unknown): string => {
  if (!str || !isString(str)) {
    throw new Error("Incorrect or missing data");
  }
  return str;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || typeof discharge !== "object") {
    throw new Error("Incorrect or missing discharge: " + discharge);
  }
  if (!("date" in discharge) || !("criteria" in discharge)) {
    throw new Error("Incorrect or missing data");
  }
  const dischargeObj = discharge as { date: unknown; criteria: unknown };
  if (!isString(dischargeObj.date) || !isDate(dischargeObj.date)) {
    throw new Error("Invalid date");
  }
  if (!isString(dischargeObj.criteria)) {
    throw new Error("Invalid criteria");
  }
  return {
    date: dischargeObj.date,
    criteria: dischargeObj.criteria,
  };
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (!sickLeave || typeof sickLeave !== "object") {
    throw new Error("Incorrect or missing sickLeave: " + sickLeave);
  }
  if (!("startDate" in sickLeave) || !("endDate" in sickLeave)) {
    throw new Error("Incorrect or missing data");
  }
  const sickLeaveObj = sickLeave as { startDate: unknown; endDate: unknown };
  if (!isString(sickLeaveObj.startDate) || !isString(sickLeaveObj.endDate)) {
    throw new Error("Invalid start date or end date");
  }
  if (!isDate(sickLeaveObj.startDate) || !isDate(sickLeaveObj.endDate)) {
    throw new Error("Invalid start date or end date");
  }
  return {
    startDate: sickLeaveObj.startDate,
    endDate: sickLeaveObj.endDate,
  };
};

const isHealthCheckType = (type: string): type is "HealthCheck" => {
  return type === "HealthCheck";
};

const isHospitalType = (type: string): type is "Hospital" => {
  return type === "Hospital";
};

const isOccupationalHealthcareType = (
  type: string
): type is "OccupationalHealthcare" => {
  return type === "OccupationalHealthcare";
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isString(rating) || !isHealthCheckRating(rating)) {
    throw new Error("Incorrect or missing Health Check Rating: " + rating);
  }
  return HealthCheckRating[rating];
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnose["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnose["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnose["code"]>;
};

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newPatient = {
      name: parseStrings(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseStrings(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseStrings(object.occupation),
      entries: [],
    };
    return newPatient;
  }
  throw new Error("Incorrect data: some fields are missing");
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if (
    "description" in object &&
    "date" in object &&
    "specialist" in object &&
    "type" in object
  ) {
    switch (object.type) {
      case "HealthCheck": {
        if (!("healthCheckRating" in object)) {
          throw new Error("Incorrect data: healthCheckRating field is missing");
        }
        const type = parseStrings(object.type);
        if (!isHealthCheckType(type)) {
          throw new Error("Incorrect type: " + type);
        }
        const newEntry: Omit<HealthCheckEntry, "id"> = {
          description: parseStrings(object.description),
          date: parseDate(object.date),
          specialist: parseStrings(object.specialist),
          type,
          healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
        };
        if ("diagnosisCodes" in object) {
          newEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
        }
        return newEntry;
      }
      case "Hospital": {
        if (!("discharge" in object)) {
          throw new Error("Incorrect data: discharge field is missing");
        }
        const type = parseStrings(object.type);
        if (!isHospitalType(type)) {
          throw new Error("Incorrect type: " + type);
        }
        const newDischarge = parseDischarge(object.discharge);
        const newEntry: Omit<HospitalEntry, "id"> = {
          description: parseStrings(object.description),
          date: parseDate(object.date),
          specialist: parseStrings(object.specialist),
          type,
          discharge: newDischarge,
        };
        return newEntry;
      }
      case "OccupationalHealthcare": {
        if (!("employerName" in object)) {
          throw new Error("Incorrect data: employerName field is missing");
        }
        const type = parseStrings(object.type);
        if (!isOccupationalHealthcareType(type)) {
          throw new Error("Incorrect type: " + type);
        }
        const newEntry: Omit<OccupationalHealthcareEntry, "id"> = {
          description: parseStrings(object.description),
          date: parseDate(object.date),
          specialist: parseStrings(object.specialist),
          type,
          employerName: parseStrings(object.employerName),
        };
        if ("sickLeave" in object) {
          newEntry.sickLeave = parseSickLeave(object.sickLeave);
        }
        return newEntry;
      }
      default: {
        throw new Error(`Unhandled entry type: ${object.type}`);
      }
    }
  }

  throw new Error("Incorrect data: some fields are missing");
};
