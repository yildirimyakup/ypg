import express from 'express';
import * as dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
const app = express();
import cors from 'cors';
import  connectDB from './config/db';
connectDB();



dotenv.config();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API çalışıyor');
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
