import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    const { ad, email, sifre, rol } = req.body;

    try {
        const mevcut = await User.findOne({ email });
        if (mevcut) return res.status(400).json({ mesaj: 'Bu email zaten kayıtlı.' });

        const sifreHash = await bcrypt.hash(sifre, 10);
        const yeniKullanici = new User({ ad, email, sifreHash, rol });

        await yeniKullanici.save();
        res.status(201).json({ mesaj: 'Kayıt başarılı.' });
    } catch (err) {
        res.status(500).json({ mesaj: 'Sunucu hatası.' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, sifre, rol } = req.body;

    try {
        const kullanici = rol ==  "ogretmen" ? await User.findOne({ email }) :await User.findOne({ kod:sifre }) ;

        if (!kullanici) return res.status(404).json({ mesaj: 'Kullanıcı bulunamadı.' });

        const dogruMu = rol ==  "ogretmen" ? await bcrypt.compare(sifre, kullanici.sifreHash) : true;
        if (!dogruMu) return res.status(401).json({ mesaj: 'Şifre hatalı.' });

        const token = jwt.sign(
            { id: kullanici._id, rol: kullanici.rol },
            process.env.JWT_SECRET || 'gizli',
            { expiresIn: '2d' }
        );

        res.json({ token, kullanici: { id: kullanici._id, ad: kullanici.ad, rol: kullanici.rol, sinifId:kullanici.sinifId} });
    } catch (err) {
        res.status(500).json({ mesaj: 'Sunucu hatası.' });
    }
};


