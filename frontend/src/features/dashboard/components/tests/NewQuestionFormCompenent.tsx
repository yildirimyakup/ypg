import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button, Box
} from "@mui/material";

import { FormControl as MuiFormControl } from '@mui/material';
import React from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    eklenecekSoru: any;
    setEklenecekSoru: any;
    handleSoruEkle: (testId:string) => void;
    id:any
}

export const NewQuestionFormComponent: React.FC<Props> = ({
                                                           open,
                                                           onClose,
                                                           eklenecekSoru,
                                                           setEklenecekSoru,
                                                           handleSoruEkle,id
                                                       }) => {
    const setHandleSoruEkle = () => {
        handleSoruEkle(id);
        onClose();
    }
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" sx={{borderRadius:"10px"}}>
            <Box sx={{                border: '8px solid #8B5E3C',
            }}>
            <DialogTitle sx={{ fontFamily: 'cursive', bgcolor: '#1e3d2f', color: 'white' }}>
                Yeni Soru Ekle
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#1e3d2f', color: 'white'}}>
                <TextField
                    fullWidth
                    label="Soru Metni"
                    value={eklenecekSoru.icerik}
                    onChange={(e) => setEklenecekSoru((prev: any) => ({ ...prev, icerik: e.target.value }))}
                    variant="standard"
                    sx={{
                        mb: 2,
                        '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#ffffffaa' },
                        '& .MuiInput-underline:after': { borderBottomColor: 'white' }
                    }}
                    InputLabelProps={{ style: { fontFamily: 'cursive', color: 'white' } }}
                    inputProps={{ style: { fontFamily: 'cursive', color: 'white' } }}
                />

                <MuiFormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel sx={{ color: 'white', fontFamily: 'cursive' }}>Soru Tipi</InputLabel>
                    <Select
                        value={eklenecekSoru.tip}
                        variant="standard"
                        onChange={(e) => {
                            const tip = e.target.value as 'coktan_secmeli' | 'dogru_yanlis';
                            setEklenecekSoru({
                                tip,
                                icerik: eklenecekSoru.icerik,
                                cevap: '',
                                secenekler: tip === 'dogru_yanlis' ? ['Doğru', 'Yanlış'] : ['', '', '', '']
                            });
                        }}
                        sx={{
                            '& .MuiInputBase-input': { color: 'white', fontFamily: 'cursive' },
                            '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#ffffffaa' },
                            '& .MuiInput-underline:after': { borderBottomColor: 'white' }
                        }}
                    >
                        <MenuItem value="coktan_secmeli">Çoktan Seçmeli</MenuItem>
                        <MenuItem value="dogru_yanlis">Doğru / Yanlış</MenuItem>
                    </Select>
                </MuiFormControl>

                <Stack direction="row" spacing={2}>
                    <Stack direction="column" spacing={2} sx={{ flex: 3 }}>
                        {eklenecekSoru.secenekler?.map((sec: string, j: number) => (
                            <TextField
                                key={j}
                                label={`Seçenek ${String.fromCharCode(65 + j)}`}
                                value={sec}
                                onChange={(e) => {
                                    const yeni = [...eklenecekSoru.secenekler];
                                    yeni[j] = e.target.value;
                                    setEklenecekSoru((prev: any) => ({ ...prev, secenekler: yeni }));
                                }}
                                variant="standard"
                                sx={{
                                    '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#ffffffaa' },
                                    '& .MuiInput-underline:after': { borderBottomColor: 'white' }
                                }}
                                InputLabelProps={{ style: { fontFamily: 'cursive', color: 'white' } }}
                                inputProps={{ style: { fontFamily: 'cursive', color: 'white' } }}
                            />
                        ))}
                    </Stack>

                    <MuiFormControl component="fieldset" sx={{ flex: 2, ml: 2 }}>
                        <FormLabel sx={{ fontFamily: 'cursive', color: 'white' }}>Doğru Cevap</FormLabel>
                        <RadioGroup
                            value={eklenecekSoru.cevap}
                            onChange={(e) => setEklenecekSoru((prev: any) => ({ ...prev, cevap: e.target.value }))}
                        >
                            {eklenecekSoru.secenekler?.map((sec: string, j: number) => (
                                <FormControlLabel
                                    key={j}
                                    value={sec}
                                    control={<Radio />}
                                    label={sec || `Seçenek ${j + 1}`}
                                    sx={{ fontFamily: 'cursive', color: 'white' }}
                                />
                            ))}
                        </RadioGroup>
                        {eklenecekSoru.cevap === '' && (
                            <FormHelperText sx={{ color: 'white' }}>Lütfen doğru cevabı seçin</FormHelperText>
                        )}
                    </MuiFormControl>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ bgcolor: '#1e3d2f' }}>
                <Button onClick={onClose} color="error">İptal</Button>
                <Button
                    variant="outlined"
                    onClick={setHandleSoruEkle}
                    color="success"
                >
                    Soruyu Ekle
                </Button>
            </DialogActions>
            </Box>
        </Dialog>
    );
};
