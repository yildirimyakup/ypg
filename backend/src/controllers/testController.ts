import { Request, Response } from 'express';
import { Test } from '../models/Test';
import { Question } from '../models/Question';

// Soru oluştur
export const createQuestion = async (req: Request, res: Response) => {
    try {
        const { tip, icerik, secenekler, cevap } = req.body;
        const yeniSoru = new Question({ tip, icerik, secenekler, cevap });
        await yeniSoru.save();
        res.status(201).json(yeniSoru);
    } catch (err) {
        res.status(500).json({ mesaj: 'Soru oluşturulamadı' });
    }
};

// Test oluştur
export const createTest = async (req: Request, res: Response) => {
    try {
        const { baslik, ogretmenId, soruIdListesi, atananSinifId } = req.body;
        const test = new Test({
            baslik,
            ogretmenId,
            soruListesi: soruIdListesi,
            atananSinifId,
            tarih: new Date()
        });
        await test.save();
        res.status(201).json(test);
    } catch (err) {
        res.status(500).json({ mesaj: 'Test oluşturulamadı' });
    }
};

// Sınıfa atanmış testleri getir
export const getTestsByClass = async (req: Request, res: Response) => {
    try {
        const { classId } = req.params;
        const tests = await Test.find({ atananSinifId: classId }).populate('soruListesi');
        res.json(tests);
    } catch (err) {
        res.status(500).json({ mesaj: 'Testler getirilemedi' });
    }
};
