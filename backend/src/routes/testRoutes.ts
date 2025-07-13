import express from 'express';
import { createQuestion, createTest, getTestsByClass } from '../controllers/testController';
import {requireRole, verifyToken} from "../middlewares/authMiddleware";

const router = express.Router();

router.post('/create', verifyToken, requireRole('ogretmen'), createTest);
router.post('/question', verifyToken, requireRole('ogretmen'), createQuestion);
router.get('/class/:classId', verifyToken, getTestsByClass); // her iki role açık olabilir

export default router;
