import axios from "axios";
import {useState} from "react";

export const useStudentReportHandler = () => {
    const [raporlar, setRaporlar] = useState<any[]>([]);

    const fetchAllStudentReports = async (token:any,ogretmenId:any) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/reports/all-students/${ogretmenId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRaporlar(res.data);
        } catch (err) {
            console.error("Tüm öğrenciler alınamadı");
        }
    };

    return {raporlar, fetchAllStudentReports};
};