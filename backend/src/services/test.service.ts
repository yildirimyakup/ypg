// src/services/test.service.ts
import Test from '../models/Test';
import Question from '../models/Question';

export const createQuestion = async (data: any) => {
    const yeniSoru = new Question(data);
    return await yeniSoru.save();
};

export const addQuestion = async ({ tip, icerik, cevap, secenekler }: any) => {
    const soru = new Question({
        tip,
        icerik,
        cevap,
        secenekler: tip === 'coktan_secmeli' ? secenekler : ['Doğru', 'Yanlış']
    });
    return await soru.save();
};

export const deleteQuestion = async (questionId: string) => {
    await Question.findByIdAndDelete(questionId);
    await Test.updateMany(
        { soruListesi: questionId },
        { $pull: { soruListesi: questionId } }
    );
    return { message: 'Soru ve ilişkili test referansları silindi' };
};

export const createTest = async ({ baslik, ogretmenId, soruIdListesi }: any) => {
    const yeniTest = new Test({
        baslik,
        ogretmenId,
        soruListesi: soruIdListesi,
        yayinDurumu: false,
        atananSiniflar: [],
    });
    return await yeniTest.save();
};

export const getTestsByTeacher = async (id: string) => {
    return await Test.find({ ogretmenId: id }).populate('soruListesi');
};

export const getTestById = async (id: string) => {
    return await Test.findById(id).populate('soruListesi');
};

export const updateTest = async (id: string, data: any) => {
    return await Test.findByIdAndUpdate(
        id,
        data,
        { new: true }
    ).populate('soruListesi');
};

export const deleteTest = async (id: string) => {
    await Test.findByIdAndDelete(id);
    return { message: 'Test silindi' };
};

export const addQuestionToTest = async (testId: string, questionId: any) => {
    const test = await Test.findById(testId);
    if (!test) throw new Error('Test bulunamadı.');

    if (test.soruListesi.includes(questionId)) {
        throw new Error('Bu soru zaten testte mevcut.');
    }

    test.soruListesi.push(questionId);
    await test.save();
    return { mesaj: 'Soru başarıyla eklendi.' };
};

export const assignClassToTest = async (testId: string, sinifId: any) => {
    const test = await Test.findById(testId);
    if (!test) throw new Error('Test bulunamadı.');

    if (!test.atananSiniflar.includes(sinifId)) {
        test.atananSiniflar.push(sinifId);
        await test.save();
    }

    return { mesaj: 'Sınıfa atandı.' };
};

export const removeClassFromTest = async (testId: string, sinifId: string) => {
    const test = await Test.findById(testId);
    if (!test) throw new Error('Test bulunamadı.');

    test.atananSiniflar = test.atananSiniflar.filter(id => id.toString() !== sinifId);
    await test.save();

    return { mesaj: 'Sınıf bağlantısı kaldırıldı.' };
};

export const getTestsByClass = async (classId: string) => {
    return await Test.find({ atananSiniflar: classId, yayinDurumu: true }).populate('soruListesi');
};

export const getTestsByTeach = async (id: string) => {
    return await Test.find({ ogretmenId: id })
        .populate('atananSiniflar', 'ad')
        .lean();
};
