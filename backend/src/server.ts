import express from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
const app = express();
import cors from 'cors';
import  connectDB from './config/db';
import classRoutes from './routes/classRoutes';
import testRoutes from './routes/testRoutes';
import resultRoutes from './routes/resultRoutes';
import reportRoutes from "./routes/reportRoutes";

connectDB();
dotenv.config();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API çalışıyor');
});

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/reports', reportRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
