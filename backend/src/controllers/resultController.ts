import { Request, Response } from 'express';
import { Result } from '../models/Result';
import { Test } from '../models/Test';
import { Question } from '../models/Question';

// 1. Öğrenci test çözdüğünde sonucu kaydet
export const submitResult = async (req: Request, res: Response) => {
    const { ogrenciId, testId, cevaplar } = req.body;

    try {
        const test = await Test.findById(testId).populate('soruListesi');
        if (!test) return res.status(404).json({ mesaj: 'Test bulunamadı.' });

        let dogruSayisi = 0;
        const toplam = test.soruListesi.length;

        // Puanlama
        (test.soruListesi as any[]).forEach((soru, i) => {
            if (soru.cevap === cevaplar[i]) {
                dogruSayisi++;
            }
        });

        const puan = Math.round((dogruSayisi / toplam) * 100);
        const geribildirim = `Toplam ${toplam} sorudan ${dogruSayisi} doğru. Başarı oranı: ${puan}%`;

        const sonuc = new Result({
            ogrenciId,
            testId,
            cevaplar,
            puan,
            geribildirim
        });

        await sonuc.save();
        res.status(201).json(sonuc);
    } catch (err) {
        res.status(500).json({ mesaj: 'Test sonucu kaydedilemedi.' });
    }
};

// 2. Öğrencinin geçmiş sonuçlarını getir
export const getResultsByStudent1 = async (req: Request, res: Response) => {
    const { studentId } = req.params;

    try {
        const sonucListesi = await Result.find({ ogrenciId: studentId }).populate('testId');
        res.json(sonucListesi);
    } catch (err) {
        res.status(500).json({ mesaj: 'Sonuçlar getirilemedi.' });
    }
};


export const getResultsByStudent = async (req: Request, res: Response) => {
    const { studentId } = req.params;

    try {
        const sonucListesi = await Result.find({ ogrenciId: studentId })
            .populate({
                path: 'testId',
                populate: {
                    path: 'soruListesi', // Test modelindeki dizi
                    model: 'Question'
                }
            });
        console.log(sonucListesi);

        // Her sonuç nesnesine test sorularını açıkça ekle
        const enrichedResults = sonucListesi.map((sonuc:any) => {
            const testSorulari = sonuc.testId?.soruListesi || [];
            return {
                ...sonuc.toObject(),
                testSorulari
            };
        });

        res.json(enrichedResults);
    } catch (err) {
        res.status(500).json({ mesaj: 'Sonuçlar getirilemedi.' });
    }
};

