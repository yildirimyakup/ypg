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
