// src/services/report.service.ts
import { Result } from '../models/Result';
import { ClassModel } from '../models/Class';
import { User } from '../models/User';
import Test from '../models/Test';

export const getClassReport = async (classId: string) => {
    const sinif = await ClassModel.findById(classId);
    if (!sinif) throw new Error('Sınıf bulunamadı.');

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
                ogrenciId: ogrenci?._id,
                testSayisi: puanlar.length,
                ortalama
            };
        })
    );

    const toplam = rapor.reduce((a, b) => a + b.ortalama, 0);
    const sinifOrt = Math.round(toplam / rapor.length || 0);

    return { sinifOrtalamasi: sinifOrt, ogrenciler: rapor };
};

export const getStudentReport = async (studentId: string) => {
    const sonuclar = await Result.find({ ogrenciId: studentId }).populate('testId');
    const puanlar = sonuclar.map(s => s.puan);
    const ortalama = puanlar.length > 0
        ? Math.round(puanlar.reduce((a, b) => a + b, 0) / puanlar.length)
        : 0;

    return {
        testSayisi: puanlar.length,
        ortalama,
        detaylar: sonuclar
    };
};

export const getUnsolvedTestsByStudent = async (studentId: string) => {
    const student = await User.findById(studentId).populate('sinifId');
    const sinifId = student?.sinifId;
    const allTests = await Test.find({ siniflar: sinifId });
    const solvedTests = await Result.find({ ogrenciId: studentId }).select('testId');

    const solvedTestIds = solvedTests.map(r => r.testId.toString());
    return allTests.filter(t => !solvedTestIds.includes(t._id.toString()));
};

export const getTestStatistics = async (testId: string) => {
    const test = await Test.findById(testId).populate('soruListesi');
    if (!test) throw new Error('Test bulunamadı.');

    const results = await Result.find({ testId });
    const totalSolvers = results.length;

    const soruIstatistikleri = test.soruListesi.map((soru: any, index: number) => {
        const secenekler: string[] = soru.secenekler;
        const secenekSayac: Record<string, number> = {};
        let dogruSayisi = 0;

        secenekler.forEach(sec => secenekSayac[sec] = 0);
        results.forEach(result => {
            const ogrCevap = result.cevaplar[index];
            if (secenekler.includes(ogrCevap)) {
                secenekSayac[ogrCevap]++;
                if (ogrCevap === soru.cevap) dogruSayisi++;
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

    return {
        testBaslik: test.baslik,
        toplamSoru: test.soruListesi.length,
        toplamCozen: totalSolvers,
        istatistikler: soruIstatistikleri
    };
};

export const getAllStudentReports = async (teacherId: string) => {
    const siniflar = await ClassModel.find({ ogretmenId: teacherId }).lean() as unknown as { _id: string; ad: string }[];
    const sinifIdToAdMap = new Map(siniflar.map(s => [s._id.toString(), s.ad]));

    const ogrenciler = await User.find({
        rol: 'ogrenci',
        sinifId: { $in: siniflar.map(s => s._id) }
    }).lean();

    const tumSonuclar = await Result.find({
        ogrenciId: { $in: ogrenciler.map(o => o._id) }
    }).lean();

    return ogrenciler.map(ogr => {
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
};
