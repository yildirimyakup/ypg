import express from 'express';
import { createClass, getClasses, addStudentToClass } from '../controllers/classController';

const router = express.Router();

router.post('/', createClass);
router.get('/:ogretmenId', getClasses);
router.put('/:classId/add', addStudentToClass);

export default router;
