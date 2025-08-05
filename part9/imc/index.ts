import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";
const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  if (Object.keys(req.query).length !== 2) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }
  if (isNaN(Number(req.query.height)) || isNaN(Number(req.query.weight))) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }
  const { height, weight } = req.query;
  return res.status(200).json({
    height,
    weight,
    bmi: calculateBmi(Number(height), Number(weight)),
  });
});

app.post("/exercises", (req, res) => {
  interface RequestBody {
    daily_exercises: number[];
    target: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: RequestBody = req.body;
  const notArrayNumber = data.daily_exercises.some((day) => isNaN(day));
  if (Object.keys(data).length < 2) {
    return res.status(400).json({
      error: "parameters missing",
    });
  }
  if (Object.keys(data).length > 2) {
    return res.status(400).json({
      error: "too many parameters",
    });
  }
  if (
    !data.daily_exercises ||
    !data.target ||
    notArrayNumber ||
    isNaN(Number(data.target))
  ) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }
  return res
    .status(200)
    .json(calculateExercises(data.daily_exercises, Number(data.target)));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
