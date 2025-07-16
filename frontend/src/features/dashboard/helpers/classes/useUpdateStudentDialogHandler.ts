import {useState} from "react";

export const useUpdateStudentDialogHandler = () => {
    const [ogrenciGuncellemeAcik, setogrenciGuncellemeAcik] = useState(false);
    const [guncellenecekOgrenciId, setGuncellenecekOgrenciId] = useState<string | null>(null);
    const [guncellenecekDeger, setguncellenecekDeger] = useState<string | null>(null);
    const handleOpenStudentUpdateDialog = (ogrenciId: string,value:string) => {
        setguncellenecekDeger(value);
        setGuncellenecekOgrenciId(ogrenciId);
        setogrenciGuncellemeAcik(true);
    };
    return {guncellenecekDeger,setguncellenecekDeger,ogrenciGuncellemeAcik, setogrenciGuncellemeAcik, guncellenecekOgrenciId, setGuncellenecekOgrenciId, handleOpenStudentUpdateDialog};

}