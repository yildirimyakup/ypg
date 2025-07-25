
import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
    try {
        const result = await registerUser(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(400).json({ mesaj: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await loginUser({email:req.body.email,sifre:req.body.sifre,rol:req.body.rol});
        res.status(200).json(result);
    } catch (err: any) {
        res.status(404).json({ mesaj: err.message });
    }
};
