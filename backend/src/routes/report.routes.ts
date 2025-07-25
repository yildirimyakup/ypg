import express from 'express';
import {
    getClassReport,
    getStudentReport,
    getUnsolvedTestsByStudent,
    getTestStatistics,
    getAllStudentReports
} from '../controllers/report.controller';
import { verifyToken, requireRole } from '../middlewares/authMiddleware';

const router = express.Router();

// Öğretmen raporları
router.get('/class/:classId', verifyToken, requireRole('ogretmen'), getClassReport);
router.get('/all-students/:teacherId', getAllStudentReports);
router.get('/test-stats/:testId', getTestStatistics);

// Öğrenci raporları
router.get('/student/:studentId',getStudentReport);
router.get('/missing-tests/:studentId', getUnsolvedTestsByStudent);


export default router;
