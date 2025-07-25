import { Result } from '../models/Result';
import Test from '../models/Test';

export const submitResult = async ({ ogrenciId, testId, cevaplar }: any) => {
    const test = await Test.findById(testId).populate('soruListesi');
    if (!test) throw new Error('Test bulunamadı.');

    let dogruSayisi = 0;
    const toplam = test.soruListesi.length;

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

    return await sonuc.save();
};

export const getResultsByStudent = async (studentId: string) => {
    const sonucListesi = await Result.find({ ogrenciId: studentId })
        .populate({
            path: 'testId',
            populate: {
                path: 'soruListesi',
                model: 'Question'
            }
        });

    return sonucListesi.map((sonuc: any) => {
        const testSorulari = sonuc.testId?.soruListesi || [];
        return {
            ...sonuc.toObject(),
            testSorulari
        };
    });
};
