import express from 'express';
import { submitResult, getResultsByStudent } from '../controllers/resultController';

const router = express.Router();

router.post('/submit', submitResult);
router.get('/student/:studentId', getResultsByStudent);

export default router;
