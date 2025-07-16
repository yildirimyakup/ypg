import {useState} from "react";

export const useDeleteClassHandler = () => {
    const [dialogAcik, setDialogAcik] = useState(false);
    const [silinicekSinifId, setSilinecekSinifId] = useState<string | null>(null);
    const handleOpenDeleteDialog = (classId: string) => {
        setSilinecekSinifId(classId);
        setDialogAcik(true);
    };
    return {dialogAcik, setDialogAcik, silinicekSinifId, setSilinecekSinifId, handleOpenDeleteDialog};
};