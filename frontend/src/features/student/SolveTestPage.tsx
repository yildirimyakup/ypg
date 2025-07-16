import {
    Box,
    Button,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent, IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import ClearIcon from '@mui/icons-material/Clear';

const SolveTestPage = () => {
    const { testId } = useParams();
    const [test, setTest] = useState<any>(null);
    const [cevaplar, setCevaplar] = useState<string[]>([]);
    const [dialogAcik, setDialogAcik] = useState(false);
    const [sonuc, setSonuc] = useState<any>(null);

    const token = localStorage.getItem('token');
    const ogrenciId = localStorage.getItem('id');
    const navigate = useNavigate();

    const getTest = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/tests/class/${localStorage.getItem('sinifId')}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const bulunan = res.data.find((t: any) => t._id === testId);
            if (bulunan) {
                setTest(bulunan);
                setCevaplar(new Array(bulunan.soruListesi.length).fill(''));
            }
        } catch {
            console.error('Test yüklenemedi.');
        }
    };

    useEffect(() => {
        getTest();
    }, []);

    const handleSec = (index: number, secenek: string) => {
        const guncel = [...cevaplar];
        guncel[index] = secenek;
        setCevaplar(guncel);
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/results/submit', {
                ogrenciId,
                testId,
                cevaplar
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSonuc(res.data);
            setDialogAcik(true);
        } catch {
            alert("Cevaplar gönderilemedi.");
        }
    };

    const dogruSayisi = test?.soruListesi.reduce((acc: number, soru: any, i: number) => {
        return cevaplar[i] === soru.cevap ? acc + 1 : acc;
    }, 0);
    const yanlisSayisi = test?.soruListesi.length - dogruSayisi;

    const chartData = [
        { name: 'Doğru', value: dogruSayisi },
        { name: 'Yanlış', value: yanlisSayisi }
    ];

    const renkler = ['#4caf50', '#f44336'];

    if (!test) return <Typography>Yükleniyor...</Typography>;

    return (
        <Box>
            <Typography variant="h4" sx={{ fontFamily: 'cursive', mb: 3, color: '#1e3d2f' }}>
                {test.baslik}
            </Typography>

            {test.soruListesi.map((soru: any, i: number) => (
                <Paper
                    key={i}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderLeft: '6px solid #4caf50',
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: '#f9f9f9'
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Soru {i + 1}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {soru.icerik}
                    </Typography>

                    <RadioGroup
                        value={cevaplar[i]}
                        onChange={(e) => handleSec(i, e.target.value)}
                    >
                        {soru.secenekler?.map((sec: string, j: number) => (
                            <FormControlLabel
                                key={j}
                                value={sec}
                                control={<Radio />}
                                label={sec}
                                sx={{
                                    mx: 1,
                                    my: 0.5,
                                    backgroundColor: cevaplar[i] === sec ? '#e8f5e9' : '#fff',
                                    borderRadius: 1,
                                    pl: 1
                                }}
                            />
                        ))}
                    </RadioGroup>
                </Paper>
            ))}

            <Divider sx={{ my: 3 }} />

            <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleSubmit}
                sx={{ py: 1.5, fontSize: '1rem' }}
            >
                Cevapları Gönder
            </Button>

            <Dialog open={dialogAcik} onClose={() => setDialogAcik(false)} maxWidth="sm" fullWidth>

                <DialogTitle>📊 Sonuç</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        Puan: {sonuc?.puan}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Geri Bildirim: {sonuc?.geribildirim}
                    </Typography>

                    <PieChart width={300} height={250}>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                            dataKey="value"
                        >
                            {chartData.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={renkler[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </DialogContent>
                <IconButton  onClick={() => {
                    setDialogAcik(false);
                    navigate('/dashboard/ogrenci/results')

                }}color="error">
                    <ClearIcon />
                </IconButton>
            </Dialog>
        </Box>
    );
};

export default SolveTestPage;
