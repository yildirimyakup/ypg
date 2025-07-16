import express from 'express';
import {
    createQuestion,
    createTest,
    getTestsByTeacher,
    getTestById,
    updateTest,
    deleteTest,
    deleteQuestion,
    addQuestionToTest,
    addQuestion,
    assignClassToTest,
    removeClassFromTest,
    getTestsByClass,
    getTestsByTeach
} from '../controllers/testController';

const router = express.Router();

// Soru işlemleri
router.post('/question', createQuestion);
router.delete('/question/:id', deleteQuestion);

// Test işlemleri
router.post('/create', createTest);
router.get('/teacher/:id', getTestsByTeacher);
router.get('/teach/:id', getTestsByTeach);
router.get('/:id', getTestById);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);
router.put('/:testId/add-question', addQuestionToTest);
router.put('/:testId/assign-class', assignClassToTest);
router.put('/:testId/remove-class', removeClassFromTest);
router.get('/class/:classId', getTestsByClass); // yeni ekleme

export default router;
