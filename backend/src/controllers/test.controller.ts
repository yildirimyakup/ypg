import { Request, Response } from 'express';
import * as TestService from '../services/test.service';

export const createQuestion = async (req: Request, res: Response) => {
    try {
        const result = await TestService.createQuestion(req.body);
        res.status(201).json(result);
    } catch {
        res.status(500).json({ message: 'Soru oluşturulamadı' });
    }
};

export const createTest = async (req: Request, res: Response) => {
    try {
        const result = await TestService.createTest(req.body);
        res.status(201).json(result);
    } catch {
        res.status(500).json({ message: 'Test oluşturulamadı' });
    }
};

export const getTestsByTeacher = async (req: Request, res: Response) => {
    try {
        const result = await TestService.getTestsByTeacher(req.params.id);
        res.json(result);
    } catch {
        res.status(500).json({ message: 'Testler getirilemedi' });
    }
};

export const getTestById = async (req: Request, res: Response) => {
    try {
        const result = await TestService.getTestById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Test bulunamadı' });
        res.json(result);
    } catch {
        res.status(500).json({ message: 'Test alınamadı' });
    }
};

export const updateTest = async (req: Request, res: Response) => {
    try {
        const result = await TestService.updateTest(req.params.id, req.body);
        res.json(result);
    } catch {
        res.status(500).json({ message: 'Test güncellenemedi' });
    }
};

export const deleteTest = async (req: Request, res: Response) => {
    try {
        const result = await TestService.deleteTest(req.params.id);
        res.json(result);
    } catch {
        res.status(500).json({ message: 'Test silinemedi' });
    }
};

export const deleteQuestion = async (req: Request, res: Response) => {
    try {
        const result = await TestService.deleteQuestion(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Soru silinirken hata oluştu.' });
    }
};

export const addQuestionToTest = async (req: Request, res: Response) => {
    const { testId } = req.params;
    const { questionId } = req.body;
    if (!questionId) return res.status(400).json({ mesaj: 'Soru ID gerekli.' });

    try {
        const result = await TestService.addQuestionToTest(testId, questionId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ mesaj: error.message });
    }
};

export const addQuestion = async (req: Request, res: Response) => {
    const { tip, icerik, cevap, secenekler } = req.body;
    if (!tip || !icerik || !cevap)
        return res.status(400).json({ mesaj: 'Tip, içerik ve cevap alanları zorunludur.' });

    try {
        const result = await TestService.addQuestion({ tip, icerik, cevap, secenekler });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ mesaj: 'Soru oluşturulamadı.', hata: err });
    }
};

export const assignClassToTest = async (req: Request, res: Response) => {
    const { testId } = req.params;
    const { sinifId } = req.body;
    if (!sinifId) return res.status(400).json({ mesaj: 'Sınıf ID gerekli.' });

    try {
        const result = await TestService.assignClassToTest(testId, sinifId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mesaj: 'Atama hatası', hata: err });
    }
};

export const removeClassFromTest = async (req: Request, res: Response) => {
    const { testId } = req.params;
    const { sinifId } = req.body;
    if (!sinifId) return res.status(400).json({ mesaj: 'Sınıf ID gerekli.' });

    try {
        const result = await TestService.removeClassFromTest(testId, sinifId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ mesaj: 'Kaldırma hatası', hata: err });
    }
};

export const getTestsByClass = async (req: Request, res: Response) => {
    try {
        const result = await TestService.getTestsByClass(req.params.classId);
        res.json(result);
    } catch {
        res.status(500).json({ mesaj: 'Sınıf testleri alınamadı.' });
    }
};

export const getTestsByTeach = async (req: Request, res: Response) => {
    try {
        const result = await TestService.getTestsByTeach(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ mesaj: 'Testler alınamadı.' });
    }
};
