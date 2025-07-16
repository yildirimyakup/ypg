import axios from "axios";
import {useState} from "react";

export const useAddStudentHandler = () => {
    const [eklenenKod, setEklenenKod] = useState('');
    const [ogrAd, setOgrAd] = useState('');
    const [ogrEmail, setOgrEmail] = useState('');

    const handleAddStudent = async (classId: string,token:any,fetchStudents:any,setHata:any) => {
        try {
            const res = await axios.put(`http://localhost:3000/api/classes/${classId}/add`, { ad: ogrAd, email: ogrEmail }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEklenenKod(res.data.ogrenci.kod);
            setOgrAd('');
            setOgrEmail('');
            fetchStudents(classId,token,setHata);
        } catch {
            setHata('Öğrenci eklenemedi.');
        }
    };

    return {eklenenKod, setEklenenKod, ogrAd, setOgrAd, ogrEmail, setOgrEmail, handleAddStudent};
};