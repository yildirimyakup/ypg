// src/controllers/report.controller.ts
import { Request, Response } from 'express';
import * as ReportService from '../services/report.service';

export const getClassReport = async (req: Request, res: Response) => {
    try {
        const result = await ReportService.getClassReport(req.params.classId);
        res.json(result);
    } catch {
        res.status(500).json({ mesaj: 'Rapor getirilemedi.' });
    }
};

export const getStudentReport = async (req: Request, res: Response) => {

    try {
        const result = await ReportService.getStudentReport(req.params.studentId);
        res.json(result);
    } catch {
        res.status(500).json({ mesaj: 'Öğrenci raporu getirilemedi.' });
    }
};

export const getUnsolvedTestsByStudent = async (req: Request, res: Response) => {
    try {
        const result = await ReportService.getUnsolvedTestsByStudent(req.params.studentId);
        res.json(result);
    } catch {
        res.status(500).json({ mesaj: 'Çözülmemiş testler alınamadı.' });
    }
};

export const getTestStatistics = async (req: Request, res: Response) => {
    try {
        const result = await ReportService.getTestStatistics(req.params.testId);
        res.json(result);
    } catch {
        res.status(500).json({ mesaj: 'Test istatistikleri alınamadı.' });
    }
};

export const getAllStudentReports = async (req: Request, res: Response) => {

    try {
        const result = await ReportService.getAllStudentReports(req.params.teacherId);
        res.json(result);
    } catch {
        res.status(500).json({ mesaj: 'Raporlar alınamadı.' });
    }
};
