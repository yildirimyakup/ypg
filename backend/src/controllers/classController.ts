import { Request, Response } from 'express';
import { ClassModel } from '../models/Class';
import { User } from '../models/User';

// Yeni sınıf oluştur
export const createClass = async (req: Request, res: Response) => {
    const { ad, ogretmenId } = req.body;

    try {
        const yeniSinif = new ClassModel({ ad, ogretmenId, ogrenciIdListesi: [] });
        await yeniSinif.save();
        res.status(201).json(yeniSinif);
    } catch (err) {
        res.status(500).json({ mesaj: 'Sınıf oluşturulamadı.' });
    }
};

// Belirli öğretmene ait sınıflar
export const getClasses = async (req: Request, res: Response) => {

    const { ogretmenId } = req.params;
    try {
        const siniflar = await ClassModel.find({ ogretmenId });
        res.json(siniflar);
    } catch (err) {
        res.status(500).json({ mesaj: 'Sınıflar alınamadı.' });
    }
};

export const getClass = async (req: Request, res: Response) => {

    const { classId } = req.params;
    try {
        const ogrenciler = await User.find({ sinifId:classId });
        res.json(ogrenciler);
    } catch (err) {
        res.status(500).json({ mesaj: 'Sınıflar alınamadı.' });
    }
};

// Sınıfa öğrenci ekle ve öğrenciye kod ata
export const addStudentToClass = async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { ad, email } = req.body;

    try {
        // 1. Öğrenci oluştur
        const kod = Math.random().toString(36).substring(2, 8).toUpperCase();
        const yeniOgrenci = new User({
            ad,
            email:kod + "--" + email,
            sifreHash: kod, // sonra sıfırlanmalı
            rol: 'ogrenci',
            kod,
            sinifId: classId
        });

        await yeniOgrenci.save();

        // 2. Sınıfa ekle
        await ClassModel.findByIdAndUpdate(classId, {
            $push: { ogrenciIdListesi: yeniOgrenci._id }
        });

        res.status(201).json({ mesaj: 'Öğrenci eklendi', ogrenci: yeniOgrenci });
    } catch (err) {
        res.status(500).json({ mesaj: 'Öğrenci eklenemedi.' });
    }
};
export const deleteClasss = async (req: Request, res: Response) => {
    const { classId } = req.params;

    try {
        // 1. Sınıf var mı kontrol et
        const sinif = await ClassModel.findById(classId);
        if (!sinif) {
            return res.status(404).json({ mesaj: 'Sınıf bulunamadı.' });
        }

        // 2. Sınıfa ait öğrencileri sil
        await User.deleteMany({ sinifId: classId });

        // 3. Sınıfı sil
        await ClassModel.findByIdAndDelete(classId);

        res.status(200).json({ mesaj: 'Sınıf ve öğrencileri başarıyla silindi.' });
    } catch (err) {
        res.status(500).json({ mesaj: 'Sınıf silinirken hata oluştu.' });
    }
};
import mongoose from 'mongoose';

export const deleteStudent = async (req: Request, res: Response) => {
    const { studentId } = req.params;

    try {
        // 1. Öğrenciyi bul
        const ogrenci = await User.findById(studentId);
        if (!ogrenci) {
            return res.status(404).json({ mesaj: 'Öğrenci bulunamadı.' });
        }

        // 2. Öğrenciyi sil
        await User.findByIdAndDelete(studentId);

        // 3. Sınıftan bu öğrenciyi çıkar
        if (ogrenci.sinifId && mongoose.Types.ObjectId.isValid(ogrenci.sinifId)) {
            await ClassModel.findByIdAndUpdate(ogrenci.sinifId, {
                $pull: { ogrenciIdListesi: studentId }
            });
        }

        res.status(200).json({ mesaj: 'Öğrenci silindi.' });
    } catch (err) {
        res.status(500).json({ mesaj: 'Öğrenci silinirken hata oluştu.' });
    }
};



export const updateStudent = async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { ad } = req.body;

    if (!ad) {
        return res.status(400).json({ mesaj: 'Yeni ad bilgisi eksik.' });
    }

    try {
        const guncellenenOgrenci = await User.findByIdAndUpdate(
            studentId,
            { ad },
            { new: true }
        );

        if (!guncellenenOgrenci) {
            return res.status(404).json({ mesaj: 'Öğrenci bulunamadı.' });
        }

        res.status(200).json({ mesaj: 'Öğrenci güncellendi.', ogrenci: guncellenenOgrenci });
    } catch (err) {
        res.status(500).json({ mesaj: 'Öğrenci güncellenemedi.' });
    }
};

export const updateClass = async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { ad } = req.body;

    if (!ad) {
        return res.status(400).json({ mesaj: 'Yeni sınıf adı girilmelidir.' });
    }

    try {
        const guncellenenSinif = await ClassModel.findByIdAndUpdate(
            classId,
            { ad },
            { new: true }
        );

        if (!guncellenenSinif) {
            return res.status(404).json({ mesaj: 'Sınıf bulunamadı.' });
        }

        res.status(200).json({ mesaj: 'Sınıf adı güncellendi.', sinif: guncellenenSinif });
    } catch (err) {
        res.status(500).json({ mesaj: 'Sınıf güncellenemedi.' });
    }
};