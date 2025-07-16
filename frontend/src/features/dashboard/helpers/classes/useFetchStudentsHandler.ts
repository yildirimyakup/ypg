import {useState} from "react";
import axios from "axios";
interface Student {
    _id: string;
    ad: string;
    kod: string;
}

export const useFetchStudentsHandler = () => {
    const [ogrenciler, setOgrenciler] = useState<Student[]>([]);
    const fetchStudents = async (classId: string,token:any,setHata:any) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/classes/${classId}/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOgrenciler(res.data);
        } catch {
            setHata('Öğrenciler alınamadı.');
        }
    };
    return {ogrenciler, fetchStudents,setOgrenciler};
};