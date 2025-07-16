import {useState} from "react";

export const useUpdateClassHandler = () => {

    const [sinifGuncelleAcik, setSinifGuncelleAcik] = useState(false);
    const [guncellenecekSinifId, setGuncellenecekSinifId] = useState<string | null>(null);
    const [guncellenecekAd, setGuncellenecekAd] = useState<string | null>(null);
    const handleOpenClassUpdateDialog = (classId: string,value:string) => {
        setGuncellenecekAd(value);
        setGuncellenecekSinifId(classId);
        setSinifGuncelleAcik(true);
    };
    return {guncellenecekAd,setGuncellenecekAd,sinifGuncelleAcik, setSinifGuncelleAcik, guncellenecekSinifId, setGuncellenecekSinifId, handleOpenClassUpdateDialog}
}