import { Request, Response } from 'express';
import Test from '../models/Test';
import Question from '../models/Question';

export const createQuestion = async (req: Request, res: Response) => {
    try {
        const yeniSoru = new Question(req.body);
        await yeniSoru.save();
        res.status(201).json(yeniSoru);
    } catch (error) {
        res.status(500).json({ message: 'Soru oluşturulamadı' });
    }
};

export const createTest = async (req: Request, res: Response) => {
    try {
        const { baslik, ogretmenId, soruIdListesi } = req.body;
        const yeniTest = new Test({
            baslik,
            ogretmenId,
            soruListesi: soruIdListesi,
            yayinDurumu: false,
            atananSiniflar: [],
        });
        await yeniTest.save();
        res.status(201).json(yeniTest);
    } catch (error) {
        res.status(500).json({ message: 'Test oluşturulamadı' });
    }
};


export const getTestsByTeacher = async (req: Request, res: Response) => {
    try {
        const tests = await Test.find({ ogretmenId: req.params.id }).populate('soruListesi');
        res.json(tests);
    } catch {
        res.status(500).json({ message: 'Testler getirilemedi' });
    }
};

export const getTestById = async (req: Request, res: Response) => {
    try {
        const test = await Test.findById(req.params.id).populate('soruListesi');
        if (!test) return res.status(404).json({ message: 'Test bulunamadı' });
        res.json(test);
    } catch {
        res.status(500).json({ message: 'Test alınamadı' });
    }
};

export const updateTest = async (req: Request, res: Response) => {
    try {
        const { baslik, atananSiniflar, yayinDurumu, yayinZamani } = req.body;
        const updated = await Test.findByIdAndUpdate(
            req.params.id,
            { baslik, atananSiniflar, yayinDurumu, yayinZamani },
            { new: true }
        ).populate('soruListesi');
        res.json(updated);
    } catch {
        res.status(500).json({ message: 'Test güncellenemedi' });
    }
};

export const deleteTest = async (req: Request, res: Response) => {
    try {
        await Test.findByIdAndDelete(req.params.id);
        res.json({ message: 'Test silindi' });
    } catch {
        res.status(500).json({ message: 'Test silinemedi' });
    }
};


export const deleteQuestion = async (req: Request, res: Response) => {
    const questionId = req.params.id;

    try {
        // 1. Soruyu sil
        await Question.findByIdAndDelete(questionId);

        // 2. Bu soruyu içeren tüm testlerden çıkart
        await Test.updateMany(
            { soruListesi: questionId },
            { $pull: { soruListesi: questionId } }
        );

        res.json({ message: 'Soru ve ilişkili test referansları silindi' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Soru silinirken hata oluştu.' });
    }
};


// PUT /api/tests/:testId/add-question
export const addQuestionToTest = async (req: Request, res: Response) => {
    const { testId } = req.params;
    const { questionId } = req.body;

    if (!questionId) {
        return res.status(400).json({ mesaj: "Soru ID gerekli." });
    }

    try {
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ mesaj: "Test bulunamadı." });
        }

        // Soru zaten eklendiyse tekrar ekleme
        if (test.soruListesi.includes(questionId)) {
            return res.status(400).json({ mesaj: "Bu soru zaten testte mevcut." });
        }

        test.soruListesi.push(questionId);
        await test.save();

        res.status(200).json({ mesaj: "Soru başarıyla eklendi." });
    } catch (error) {
        res.status(500).json({ mesaj: "Sunucu hatası.", hata: error });
    }
};

// POST /api/tests/question
export const addQuestion = async (req: Request, res: Response) => {
    const { tip, icerik, cevap, secenekler } = req.body;

    if (!tip || !icerik || !cevap) {
        return res.status(400).json({ mesaj: 'Tip, içerik ve cevap alanları zorunludur.' });
    }

    try {
        const yeniSoru = new Question({
            tip,
            icerik,
            cevap,
            secenekler: tip === 'coktan_secmeli' ? secenekler : ['Doğru', 'Yanlış']
        });

        const kayit = await yeniSoru.save();
        return res.status(201).json(kayit);
    } catch (err) {
        return res.status(500).json({ mesaj: 'Soru oluşturulamadı.', hata: err });
    }
};
// PUT /api/tests/:testId/assign-class
export const assignClassToTest = async (req: Request, res: Response) => {
    const { testId } = req.params;
    const { sinifId } = req.body;

    if (!sinifId) return res.status(400).json({ mesaj: "Sınıf ID gerekli." });

    try {
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ mesaj: "Test bulunamadı." });

        if (!test.atananSiniflar.includes(sinifId)) {
            test.atananSiniflar.push(sinifId);
            await test.save();
        }

        return res.status(200).json({ mesaj: "Sınıfa atandı." });
    } catch (err) {
        return res.status(500).json({ mesaj: "Atama hatası", hata: err });
    }
};
// PUT /api/tests/:testId/remove-class
export const removeClassFromTest = async (req: Request, res: Response) => {
    const { testId } = req.params;
    const { sinifId } = req.body;

    if (!sinifId) return res.status(400).json({ mesaj: "Sınıf ID gerekli." });

    try {
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ mesaj: "Test bulunamadı." });

        test.atananSiniflar = test.atananSiniflar.filter(id => id.toString() !== sinifId);
        await test.save();

        return res.status(200).json({ mesaj: "Sınıf bağlantısı kaldırıldı." });
    } catch (err) {
        return res.status(500).json({ mesaj: "Kaldırma hatası", hata: err });
    }
};
export const getTestsByClass = async (req: Request, res: Response) => {
    const { classId } = req.params;

    try {
        const tests = await Test.find({
            atananSiniflar: classId,
            yayinDurumu: true
        }).populate('soruListesi');

        res.json(tests);
    } catch (err) {
        res.status(500).json({ mesaj: 'Sınıf testleri alınamadı.' });
    }
};


export const getTestsByTeach = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const tests = await Test.find({ ogretmenId: id })
            .populate('atananSiniflar', 'ad') // sadece ad bilgisini al
            .lean();
        console.log(tests);
        res.json(tests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mesaj: 'Testler alınamadı.' });
    }
};