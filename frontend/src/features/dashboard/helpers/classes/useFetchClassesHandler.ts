import {useState} from "react";
import axios from "axios";
interface ClassData {
    _id: string;
    ad: string;
}

export const useFetchClassesHandler = () => {
    const [siniflar, setSiniflar] = useState<ClassData[]>([]);
    const fetchClasses = async (id:any,token:any,setHata:any) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/classes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSiniflar(res.data);
        } catch {
            setHata('Sınıflar alınamadı.');
        }
    };
    return {siniflar, fetchClasses,setSiniflar};
};