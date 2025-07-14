import {
    Box, Button, Typography, RadioGroup, FormControlLabel,
    Radio, Paper, Alert
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SolveTestPage = () => {
    const { testId } = useParams();
    const [test, setTest] = useState<any>(null);
    const [cevaplar, setCevaplar] = useState<string[]>([]);
    const [mesaj, setMesaj] = useState('');
    const token = localStorage.getItem('token');
    const ogrenciId = localStorage.getItem('id');

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

            setMesaj(`Test tamamlandı. Puan: ${res.data.puan} | ${res.data.geribildirim}`);
        } catch {
            setMesaj('Cevaplar gönderilemedi.');
        }
    };

    if (!test) return <Typography>Yükleniyor...</Typography>;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>{test.baslik}</Typography>

            {test.soruListesi.map((soru: any, i: number) => (
                <Paper key={i} sx={{ p: 2, mb: 2 }}>
                    <Typography><strong>Soru {i + 1}:</strong> {soru.icerik}</Typography>
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
                            />
                        ))}
                    </RadioGroup>
                </Paper>
            ))}

            <Button variant="contained" onClick={handleSubmit}>Cevapları Gönder</Button>

            {mesaj && <Alert severity="info" sx={{ mt: 3 }}>{mesaj}</Alert>}
        </Box>
    );
};

export default SolveTestPage;
