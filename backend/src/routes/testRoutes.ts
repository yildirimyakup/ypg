import express from 'express';
import { createQuestion, createTest, getTestsByClass } from '../controllers/testController';

const router = express.Router();

router.post('/question', createQuestion);
router.post('/create', createTest);
router.get('/class/:classId', getTestsByClass);

export default router;
