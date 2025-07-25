// src/routes/test.routes.ts
import express from 'express';
import * as TestController from '../controllers/test.controller';

const router = express.Router();

router.post('/create', TestController.createTest);
router.get('/teacher/:id', TestController.getTestsByTeacher);
router.get('/teach/:id', TestController.getTestsByTeach);
router.get('/:id', TestController.getTestById);
router.put('/:id', TestController.updateTest);
router.delete('/:id', TestController.deleteTest);

router.post('/question/create', TestController.createQuestion);
router.post('/question', TestController.addQuestion);
router.delete('/question/:id', TestController.deleteQuestion);
router.put('/:testId/add-question', TestController.addQuestionToTest);

router.put('/:testId/assign-class', TestController.assignClassToTest);
router.put('/:testId/remove-class', TestController.removeClassFromTest);
router.get('/class/:classId', TestController.getTestsByClass);

export default router;