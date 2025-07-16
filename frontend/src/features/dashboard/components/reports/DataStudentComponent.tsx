import TextField from "@mui/material/TextField";
import {DataGrid} from "@mui/x-data-grid";
import React from "react";
interface Props {
    ogrenciArama:string;
    setOgrenciArama:any;
    filteredRows:any;
    ogrenciColumns:any;
    setModalAcik:any;
    modalAcik:any;
}
export const DataStudentComponent:React.FC<Props> = ({ogrenciArama,setOgrenciArama,filteredRows,ogrenciColumns,setModalAcik}) => {
    return (
        <>
            <TextField
                label="Öğrenci Ara"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={ogrenciArama}
                onChange={(e) => setOgrenciArama(e.target.value)}
            />

            <DataGrid
                rows={filteredRows}
                columns={ogrenciColumns}
                onRowClick={() => setModalAcik(true)}
                autoHeight
                getRowId={(row:any) => row.ogrenciId}
            />
        </>
    )
}