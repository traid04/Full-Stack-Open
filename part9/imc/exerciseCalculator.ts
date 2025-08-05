import { isNotNumber } from "./utils/isNotNumber";
import { isNotAnArrayNumber } from "./utils/isNotAnArrayNumber";

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface Args {
  target: number;
  days: number[];
}

const parseArguments = (args: string[]): Args => {
  const [, , target, ...days] = args;
  const parsedDays = days.map((day) => Number(day));
  if (isNotNumber(target) || isNotAnArrayNumber(days)) {
    throw new Error("Solo se permiten numeros");
  } else {
    return {
      target: Number(target),
      days: parsedDays,
    };
  }
};

export const calculateExercises = (days: number[], target: number): Result => {
  let trainingDays = 0;
  let totalHours = 0;
  days.forEach((day) => {
    if (day > 0) {
      trainingDays++;
    }
    totalHours += day;
  });
  let rating = 0;
  let ratingDescription = "";
  const average = totalHours / days.length;
  if (average >= target) {
    rating = 3;
    ratingDescription = "Target accomplished!";
  } else if (average - target > -1) {
    rating = 2;
    ratingDescription = "Not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "Bad";
  }
  return {
    periodLength: days.length,
    trainingDays,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { target, days } = parseArguments(process.argv);
  console.log(calculateExercises(days, target));
} catch (error) {
  let errorMessage = "Something bad happened. ";
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
