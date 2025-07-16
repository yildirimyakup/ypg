import express from 'express';
import {
    getAllStudentReports,
    getClassReport,
    getStudentReport,
    getTestStatistics,
    getUnsolvedTestsByStudent
} from '../controllers/reportController';
import {requireRole, verifyToken} from "../middlewares/authMiddleware";

const router = express.Router();

router.get('/class/:classId', verifyToken, requireRole('ogretmen'), getClassReport);
router.get('/student/:studentId', verifyToken, requireRole('ogretmen'), getStudentReport);
router.get('/missing-tests/:studentId', getUnsolvedTestsByStudent);
// reportRoutes.ts
router.get('/test-stats/:testId', getTestStatistics);
router.get('/all-students/:teacherId', getAllStudentReports);


export default router;
