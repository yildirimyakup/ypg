import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
    rol: 'ogretmen' | 'ogrenci';
}

declare global {
    namespace Express {
        interface Request {
            kullanici?: JwtPayload;
        }
    }
}

// Token doğrulama
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ mesaj: 'Token eksik' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli') as JwtPayload;
        req.kullanici = decoded;
        next();
    } catch (err) {
        res.status(401).json({ mesaj: 'Geçersiz token' });
    }
};

// Rol kontrolü
export const requireRole = (rol: 'ogretmen' | 'ogrenci') => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.kullanici)
            return res.status(403).json({ mesaj: 'Kimlik doğrulaması yok' });

        if (req.kullanici.rol !== rol)
            return res.status(403).json({ mesaj: 'Erişim izniniz yok' });

        next();
    };
};
