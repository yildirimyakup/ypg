// src/routes/result.routes.ts
import express from 'express';
import { submitResult, getResultsByStudent } from '../controllers/result.controller';
import { verifyToken, requireRole } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/submit', verifyToken, requireRole('ogrenci'), submitResult);
router.get('/student/:studentId', getResultsByStudent);

export default router;
