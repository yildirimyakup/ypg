// src/controllers/class.controller.ts
import { Request, Response } from 'express';
import * as ClassService from '../services/class.service';

export const createClass = async (req: Request, res: Response) => {
    try {
        const result = await ClassService.createClass(req.body);
        res.status(201).json(result);
    } catch {
        res.status(500).json({ mesaj: 'Sınıf oluşturulamadı.' });
    }
};

export const getClasses = async (req: Request, res: Response) => {
    try {
        const result = await ClassService.getClasses(req.params.ogretmenId);
        res.json(result);
    } catch {
        res.status(500).json({ mesaj: 'Sınıflar alınamadı.' });
    }
};

export const getClass = async (req: Request, res: Response) => {
   console.log()
    try {
        const result = await ClassService.getClass(req.params.classId);
        res.json(result);
    } catch {
        res.status(500).json({ mesaj: 'Sınıflar alınamadı.' });
    }
};

export const addStudentToClass = async (req: Request, res: Response) => {
    try {
        const result = await ClassService.addStudentToClass(req.params.classId, req.body);
        res.status(201).json(result);
    } catch {
        res.status(500).json({ mesaj: 'Öğrenci eklenemedi.' });
    }
};

export const deleteClasss = async (req: Request, res: Response) => {
    try {
        const result = await ClassService.deleteClasss(req.params.classId);
        res.status(200).json(result);
    } catch {
        res.status(500).json({ mesaj: 'Sınıf silinirken hata oluştu.' });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const result = await ClassService.deleteStudent(req.params.studentId);
        res.status(200).json(result);
    } catch {
        res.status(500).json({ mesaj: 'Öğrenci silinirken hata oluştu.' });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { ad } = req.body;
    if (!ad) return res.status(400).json({ mesaj: 'Yeni ad bilgisi eksik.' });

    try {
        const result = await ClassService.updateStudent(studentId, ad);
        res.status(200).json(result);
    } catch {
        res.status(500).json({ mesaj: 'Öğrenci güncellenemedi.' });
    }
};

export const updateClass = async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { ad } = req.body;
    if (!ad) return res.status(400).json({ mesaj: 'Yeni sınıf adı girilmelidir.' });

    try {
        const result = await ClassService.updateClass(classId, ad);
        res.status(200).json(result);
    } catch {
        res.status(500).json({ mesaj: 'Sınıf güncellenemedi.' });
    }
};
