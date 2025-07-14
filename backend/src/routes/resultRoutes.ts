import express from 'express';
import { submitResult, getResultsByStudent } from '../controllers/resultController';
import {requireRole, verifyToken} from "../middlewares/authMiddleware";

const router = express.Router();

router.post('/submit', verifyToken, requireRole('ogrenci'), submitResult);

router.get('/student/:studentId', verifyToken, getResultsByStudent);


export default router;
