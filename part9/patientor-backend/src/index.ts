import express from 'express';
import cors from 'cors';
import diagnosesRoutes from './routes/diagnoses'
import patientsRoutes from './routes/patients'
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
    console.log('someone pinged here')
    res.send('pong');
})

app.use('/api/diagnoses', diagnosesRoutes)
app.use('/api/patients', patientsRoutes)

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})