import {
    Paper, TextField, Typography ,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from "@mui/material";

import {
    FormControl as MuiFormControl
} from '@mui/material';
import React from "react";
interface Props{
    i:any;
    soru:any;
    yeniSorular:any;
    setYeniSorular:any;

}
export const QuestionFormKomponents:React.FC<Props> = ({i,soru,yeniSorular,setYeniSorular}) => {
    return(
        <Paper sx={{ p: 3, mb: 3, border: '1px solid #ccc', width:"100%",borderRadius: 2, backgroundColor: '#fdfdfd' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', fontFamily: 'cursive' }}>
                Soru {i + 1}
            </Typography>

            <TextField
                fullWidth
                label="Soru Metni"
                value={soru.icerik}
                onChange={(e) => {
                    const guncel = [...yeniSorular];
                    guncel[i].icerik = e.target.value;
                    setYeniSorular(guncel);
                }}
                sx={{ mb: 2 }}
                InputLabelProps={{ style: { fontFamily: 'cursive' } }}
                inputProps={{ style: { fontFamily: 'cursive' } }}
            />

            <MuiFormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id={`tip-label-${i}`}>Soru Tipi</InputLabel>
                <Select
                    labelId={`tip-label-${i}`}
                    value={soru.tip}
                    label="Soru Tipi"
                    onChange={(e) => {
                        const guncel = [...yeniSorular];
                        guncel[i].tip = e.target.value as 'coktan_secmeli' | 'dogru_yanlis';
                        guncel[i].secenekler = guncel[i].tip === 'dogru_yanlis' ? ['Doğru', 'Yanlış'] : ['', '', '', ''];
                        guncel[i].cevap = '';
                        setYeniSorular(guncel);
                    }}
                >
                    <MenuItem value="coktan_secmeli">Çoktan Seçmeli</MenuItem>
                    <MenuItem value="dogru_yanlis">Doğru / Yanlış</MenuItem>
                </Select>
            </MuiFormControl>

            <Stack direction="row" spacing={2}  sx={{ mb: 2 }}>

                <Stack direction="column" spacing={2} flexWrap="wrap" sx={{ mb: 2,flex:"1" }}>
                    {soru.secenekler?.map((sec:any, j:any) => (
                        <TextField
                            key={j}
                            label={`Seçenek ${String.fromCharCode(65 + j)}`}
                            value={sec}
                            onChange={(e) => {
                                const guncel = [...yeniSorular];
                                guncel[i].secenekler![j] = e.target.value;
                                setYeniSorular(guncel);
                            }}
                            InputLabelProps={{ style: { fontFamily: 'cursive' } }}
                            inputProps={{ style: { fontFamily: 'cursive' } }}
                        />
                    ))}
                </Stack>
                <MuiFormControl component="fieldset" sx={{ mt: 2,flex:"1" }}>
                    <FormLabel component="legend" sx={{ fontFamily: 'cursive' }}>Doğru Cevap</FormLabel>
                    <RadioGroup
                        value={soru.cevap}
                        onChange={(e) => {
                            const guncel = [...yeniSorular];
                            guncel[i].cevap = e.target.value;
                            setYeniSorular(guncel);
                        }}
                    >
                        {soru.secenekler?.map((sec:any, j:any) => (
                            <FormControlLabel
                                key={j}
                                value={sec}
                                control={<Radio />}
                                label={sec || `Seçenek ${j + 1}`}
                                sx={{ fontFamily: 'cursive' }}
                            />
                        ))}
                    </RadioGroup>
                    {soru.cevap === '' && <FormHelperText>Lütfen doğru cevabı seçin</FormHelperText>}
                </MuiFormControl>

            </Stack>



        </Paper>

    );
}