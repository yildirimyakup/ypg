import { ClassModel } from '../models/Class';
import { User } from '../models/User';
import mongoose from 'mongoose';

export const createClass = async ({ ad, ogretmenId }: any) => {
    const yeniSinif = new ClassModel({ ad, ogretmenId, ogrenciIdListesi: [] });
    return await yeniSinif.save();
};

export const getClasses = async (ogretmenId: string) => {
    return await ClassModel.find({ ogretmenId });
};

export const getClass = async (classId: string) => {
    return await User.find({ sinifId: classId });
};

export const addStudentToClass = async (classId: string, { ad, email }: any) => {
    const kod = Math.random().toString(36).substring(2, 8).toUpperCase();
    const yeniOgrenci = new User({
        ad,
        email: kod + "--" + email,
        sifreHash: kod,
        rol: 'ogrenci',
        kod,
        sinifId: classId
    });
    await yeniOgrenci.save();

    await ClassModel.findByIdAndUpdate(classId, {
        $push: { ogrenciIdListesi: yeniOgrenci._id }
    });

    return { mesaj: 'Öğrenci eklendi', ogrenci: yeniOgrenci };
};

export const deleteClasss = async (classId: string) => {
    const sinif = await ClassModel.findById(classId);
    if (!sinif) throw new Error('Sınıf bulunamadı.');

    await User.deleteMany({ sinifId: classId });
    await ClassModel.findByIdAndDelete(classId);

    return { mesaj: 'Sınıf ve öğrencileri başarıyla silindi.' };
};

export const deleteStudent = async (studentId: string) => {
    const ogrenci = await User.findById(studentId);
    if (!ogrenci) throw new Error('Öğrenci bulunamadı.');

    await User.findByIdAndDelete(studentId);

    if (ogrenci.sinifId && mongoose.Types.ObjectId.isValid(ogrenci.sinifId)) {
        await ClassModel.findByIdAndUpdate(ogrenci.sinifId, {
            $pull: { ogrenciIdListesi: studentId }
        });
    }

    return { mesaj: 'Öğrenci silindi.' };
};

export const updateStudent = async (studentId: string, ad: string) => {
    const ogrenci = await User.findByIdAndUpdate(
        studentId,
        { ad },
        { new: true }
    );

    if (!ogrenci) throw new Error('Öğrenci bulunamadı.');

    return { mesaj: 'Öğrenci güncellendi.', ogrenci };
};

export const updateClass = async (classId: string, ad: string) => {
    const sinif = await ClassModel.findByIdAndUpdate(
        classId,
        { ad },
        { new: true }
    );

    if (!sinif) throw new Error('Sınıf bulunamadı.');

    return { mesaj: 'Sınıf adı güncellendi.', sinif };
};
