import {Box, Button, Stack, Typography} from "@mui/material";
import React from "react";
interface Props {
    o: any;
    handleOpenStudentDeleteDialog: any;
    handleOpenStudentUpdateDialog:any;
    ogrenciler:any;
}
export const StudentShowComponents:React.FC<Props>= ({o,handleOpenStudentDeleteDialog,handleOpenStudentUpdateDialog,ogrenciler}) =>  {
    return (
        <Box  display="flex" justifyContent="space-between" alignItems="center" mb={1} sx={{borderTop:"0.5px solid white"}}>
            <Typography>{o.ad} ({o.kod})</Typography>
            <Stack direction="row" spacing={1}>
                <Button size="small" color="error" onClick={() => handleOpenStudentDeleteDialog(o._id)}>Sil</Button>
                <Button size="small" onClick={() => {handleOpenStudentUpdateDialog(o._id, ogrenciler.find((b:any) => b._id ===  o._id)?.ad || '')
                }}>Düzenle</Button>
            </Stack>
        </Box>
    )
}