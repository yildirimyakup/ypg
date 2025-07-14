import express from 'express';
import { createClass, getClasses, addStudentToClass } from '../controllers/classController';
import {requireRole, verifyToken} from "../middlewares/authMiddleware";

const router = express.Router();

router.get('/:ogretmenId', verifyToken, requireRole('ogretmen'), getClasses);

router.post('/create', verifyToken, requireRole('ogretmen'), createClass);

router.put('/:classId/add', verifyToken, requireRole('ogretmen'), addStudentToClass);

export default router;
