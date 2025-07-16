import { Request, Response } from 'express';
import { Result } from '../models/Result';
import { ClassModel } from '../models/Class';
import { User } from '../models/User';
import Test  from '../models/Test';

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
                    ogrenciId:ogrenci?._id,
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
export const getUnsolvedTestsByStudent = async (req: Request, res: Response) => {
    const { studentId } = req.params;

    try {
        const student = await User.findById(studentId).populate('sinifId');
        const sinifId = student?.sinifId;

        const allTests = await Test.find({ siniflar: sinifId });
        const solvedTests = await Result.find({ ogrenciId: studentId }).select('testId');

        const solvedTestIds = solvedTests.map(r => r.testId.toString());
        const unsolvedTests = allTests.filter(t => !solvedTestIds.includes(t._id.toString()));

        res.json(unsolvedTests);
    } catch (err) {
        res.status(500).json({ mesaj: 'Çözülmemiş testler alınamadı.' });
    }
};



export const getTestStatistics = async (req: Request, res: Response) => {
    const { testId } = req.params;

    try {
        // 1. Testi ve ilişkili soruları getir
        const test = await Test.findById(testId).populate('soruListesi');
        if (!test) return res.status(404).json({ mesaj: 'Test bulunamadı.' });

        const results = await Result.find({ testId });
        const totalSolvers = results.length;

        // 2. Her soru için istatistik üret
        const soruIstatistikleri = test.soruListesi.map((soru: any, index: number) => {
            const secenekler: string[] = soru.secenekler;
            const secenekSayac: Record<string, number> = {};
            let dogruSayisi = 0;

            // Seçenekleri başlat
            secenekler.forEach(sec => secenekSayac[sec] = 0);

            // Tüm sonuçlar üzerinden dön
            results.forEach(result => {
                const ogrCevap = result.cevaplar[index];

                if (secenekler.includes(ogrCevap)) {
                    secenekSayac[ogrCevap]++;

                    if (ogrCevap === soru.cevap) {
                        dogruSayisi++;
                    }
                }
            });

            const dogruYuzde = totalSolvers > 0 ? (dogruSayisi / totalSolvers) * 100 : 0;

            return {
                soruNo: index + 1,
                icerik: soru.icerik,
                dogruYuzde: parseFloat(dogruYuzde.toFixed(1)),
                secenekSayac
            };
        });

        console.log("Test istatistikleri:");
        console.log("Test adı :", test.baslik);
        console.log("Soru Listesi :", test.soruListesi);
        console.log("Soru Sayısı :", test.soruListesi.length);
        // 3. JSON olarak gönder
        return res.json({
            testBaslik: test.baslik,
            toplamSoru: test.soruListesi.length,
            toplamCozen: totalSolvers,
            istatistikler: soruIstatistikleri
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ mesaj: 'Test istatistikleri alınamadı.' });
    }
};


export const getAllStudentReports = async (req: Request, res: Response) => {
    const { teacherId } = req.params;

    try {
        // 1. Öğretmenin sınıflarını al
        const siniflar = await ClassModel.find({ogretmenId: teacherId}).lean() as unknown as { _id: string; ad: string }[];

        const sinifIdToAdMap = new Map(siniflar.map(s => [s._id.toString(), s.ad]));

        // 2. Öğrencileri getir
        const ogrenciler = await User.find({
            rol: 'ogrenci',
            sinifId: { $in: siniflar.map(s => s._id) }
        }).lean();

        // 3. Sonuçları getir
        const tumSonuclar = await Result.find({
            ogrenciId: { $in: ogrenciler.map(o => o._id) }
        }).lean();

        // 4. Öğrenci bazlı raporu oluştur
        const raporlar = ogrenciler.map(ogr => {
            const ogrSonuclar = tumSonuclar.filter(s => s.ogrenciId.toString() === ogr._id.toString());
            const testSayisi = ogrSonuclar.length;
            const ortalama = testSayisi > 0
                ? ogrSonuclar.reduce((toplam, s) => toplam + s.puan, 0) / testSayisi
                : 0;

            return {
                ogrenciId: ogr._id,
                ogrenciAd: ogr.ad,
                sinifAd: sinifIdToAdMap.get(ogr.sinifId?.toString() || '') || 'Bilinmiyor',
                testSayisi,
                ortalama: ortalama.toFixed(2),
            };
        });

        res.json(raporlar);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mesaj: 'Raporlar alınamadı.' });
    }
};
