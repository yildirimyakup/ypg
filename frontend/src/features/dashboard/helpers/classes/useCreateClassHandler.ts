import {useState} from "react";
import axios from "axios";

export const useCreateClassHandler = () => {
    const [sinifAd, setSinifAd] = useState('');
    const [mesaj, setMesaj] = useState('');

    const handleCreateClass = async (id:any,token:any,fetchClasses:any,setHata:any) => {
        if (!sinifAd) return;
        try {
            await axios.post('http://localhost:3000/api/classes/create', { ad: sinifAd, ogretmenId:id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMesaj('Sınıf oluşturuldu.');
            setSinifAd('');
            fetchClasses(id,token,setHata);
        } catch {
            setHata('Sınıf oluşturulamadı.');
        }
    };
    return {sinifAd, setSinifAd, mesaj, setMesaj, handleCreateClass};
};