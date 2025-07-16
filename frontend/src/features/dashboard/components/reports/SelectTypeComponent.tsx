import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React from "react";
interface Props {
    secim:any;
    setSecim:any;
}
export const SelectTypeComponent:React.FC<Props> = ({secim,setSecim}) => {
    return(
        <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Rapor Tipi</InputLabel>
            <Select
                value={secim}
                label="Rapor Tipi"
                onChange={(e) => setSecim(e.target.value as 'ogrenci' | 'test')}
            >
                <MenuItem value="ogrenci">Öğrenci Bazlı</MenuItem>
                <MenuItem value="test">Test Bazlı</MenuItem>
            </Select>
        </FormControl>
    )
}