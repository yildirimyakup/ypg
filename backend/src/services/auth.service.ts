import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/User';

export const registerUser = async ({ ad, email, sifre, rol }: any) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("Bu e-posta zaten kayıtlı.");

    const hashed = await bcrypt.hash(sifre, 10);
    const user = new User({ ad, email, sifreHash: hashed, rol });
    await user.save();

    return { message: "Kayıt başarılı", userId: user._id };
};


export const loginUser = async ({ email, sifre, rol }: any) => {
    // Öğrenci girişi: sadece kod ile
    if (rol == "ogrenci") {
        const student = await User.findOne({ kod:sifre, rol: 'ogrenci' });
        if (!student) throw new Error("Geçersiz öğrenci kodu.");

        const token = jwt.sign({ id: student._id, rol: student.rol }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });
        return { token, kullanici: { id: student._id, ad: student.ad, rol: student.rol, sinifId:student.sinifId} };

    }

    // Öğretmen girişi: email + şifre
    if (rol === "ogretmen") {
        const teacher = await User.findOne({ email, rol: 'ogretmen' });
        if (!teacher) throw new Error("Öğretmen bulunamadı.");

        const isMatch = await bcrypt.compare(sifre, teacher.sifreHash);
        if (!isMatch) throw new Error("Şifre yanlış.");

        const token = jwt.sign({ id: teacher._id, rol: teacher.rol }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });

        return { token, kullanici: { id: teacher._id, ad: teacher.ad, rol: teacher.rol, sinifId:teacher.sinifId} };
    }

    // Eğer ne email+şifre ne de kod varsa
    throw new Error("Geçerli giriş bilgileri sağlanmadı.");
};
