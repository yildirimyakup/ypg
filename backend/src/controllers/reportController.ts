import { Request, Response } from 'express';
import { Result } from '../models/Result';
import { ClassModel } from '../models/Class';
import { User } from '../models/User';

// Sınıf bazlı başarı raporu
export const getClassReport = async (req: Request, res: Response) => {
    const { classId } = req.params;

    try {
        const sinif = await ClassModel.findById(classId);
        if (!sinif) return res.status(404).json({ mesaj: 'Sınıf bulunamadı.' });

        // Öğrenci listesi üzerinden sonuçları topla
        const rapor = await Promise.all(
            sinif.ogrenciIdListesi.map(async (ogrenciId) => {
                const ogrenci = await User.findById(ogrenciId);
                const sonuclar = await Result.find({ ogrenciId });

                const puanlar = sonuclar.map(s => s.puan);
                const ortalama = puanlar.length > 0
                    ? Math.round(puanlar.reduce((a, b) => a + b, 0) / puanlar.length)
                    : 0;

                return {
                    ogrenciAd: ogrenci?.ad,
                    testSayisi: puanlar.length,
                    ortalama
                };
            })
        );

        // Sınıf ortalaması
        const toplam = rapor.reduce((a, b) => a + b.ortalama, 0);
        const sinifOrt = Math.round(toplam / rapor.length || 0);

        res.json({ sinifOrtalamasi: sinifOrt, ogrenciler: rapor });
    } catch (err) {
        res.status(500).json({ mesaj: 'Rapor getirilemedi.' });
    }
};

// Öğrenci bazlı başarı raporu
export const getStudentReport = async (req: Request, res: Response) => {
    const { studentId } = req.params;

    try {
        const sonuclar = await Result.find({ ogrenciId: studentId }).populate('testId');

        const puanlar = sonuclar.map(s => s.puan);
        const ortalama = puanlar.length > 0
            ? Math.round(puanlar.reduce((a, b) => a + b, 0) / puanlar.length)
            : 0;

        res.json({
            testSayisi: puanlar.length,
            ortalama,
            detaylar: sonuclar
        });
    } catch (err) {
        res.status(500).json({ mesaj: 'Öğrenci raporu getirilemedi.' });
    }
};
