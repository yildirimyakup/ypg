import {useState} from "react";

export const useDeleteStudentDialogHandler = () => {
    const [ogrenciDialogAcik, setogrenciDialogAcik] = useState(false);
    const [silinicekOgrenciId, setSilinecekOgrenciId] = useState<string | null>(null);
    const handleOpenStudentDeleteDialog = (ogrenciId: string) => {
        setSilinecekOgrenciId(ogrenciId);
        setogrenciDialogAcik(true);
    };
    return {ogrenciDialogAcik, setogrenciDialogAcik, silinicekOgrenciId, setSilinecekOgrenciId, handleOpenStudentDeleteDialog};

}