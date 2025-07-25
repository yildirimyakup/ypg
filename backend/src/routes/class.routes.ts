// src/routes/class.routes.ts
import express from 'express';
import {
    createClass,
    getClasses,
    addStudentToClass,
    getClass,
    deleteClasss,
    deleteStudent,
    updateStudent,
    updateClass
} from '../controllers/class.controller';
import { verifyToken, requireRole } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/:ogretmenId', verifyToken, requireRole('ogretmen'), getClasses);
router.get('/:classId/students', verifyToken, requireRole('ogretmen'), getClass);

router.post('/create', verifyToken, requireRole('ogretmen'), createClass);

router.put('/:classId/add', verifyToken, requireRole('ogretmen'), addStudentToClass);
router.delete('/:classId', verifyToken, requireRole('ogretmen'), deleteClasss);
router.delete('/student/:studentId', verifyToken, requireRole('ogretmen'), deleteStudent);
router.put('/student/:studentId', verifyToken, requireRole('ogretmen'), updateStudent);
router.put('/:classId', verifyToken, requireRole('ogretmen'), updateClass);

export default router;