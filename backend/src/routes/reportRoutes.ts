import express from 'express';
import { getClassReport, getStudentReport } from '../controllers/reportController';
import {requireRole, verifyToken} from "../middlewares/authMiddleware";

const router = express.Router();

router.get('/class/:classId', verifyToken, requireRole('ogretmen'), getClassReport);
router.get('/student/:studentId', verifyToken, requireRole('ogretmen'), getStudentReport);


export default router;
