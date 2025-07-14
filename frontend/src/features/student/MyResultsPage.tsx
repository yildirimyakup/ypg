import {
    Box, Typography, Paper, Stack, Dialog,
    DialogTitle, DialogContent
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const MyResultsPage = () => {
    const [sonuclar, setSonuclar] = useState<any[]>([]);
    const token = localStorage.getItem('token');
    const ogrenciId = localStorage.getItem('id');
    const [acik, setAcik] = useState(false);
    const [seciliSonuc, setSeciliSonuc] = useState<any | null>(null);

    const renkler = ['#4caf50', '#f44336']; // Doğru: Yeşil, Yanlış: Kırmızı

    const dogruSayisi = seciliSonuc?.testSorulari.reduce((count: number, soru: any, i: number) => {
        return seciliSonuc.cevaplar[i] === soru.cevap ? count + 1 : count;
    }, 0);

    const yanlisSayisi = seciliSonuc?.testSorulari.length - dogruSayisi;

    const chartData = [
        { name: 'Doğru', value: dogruSayisi },
        { name: 'Yanlış', value: yanlisSayisi }
    ];

    const handleOpenDetail = (sonuc: any) => {
        setSeciliSonuc(sonuc);
        setAcik(true);
    };

    const fetchResults = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/results/student/${ogrenciId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSonuclar(res.data);
        } catch {
            console.error('Sonuçlar alınamadı.');
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Geçmiş Test Sonuçlarım</Typography>

            {sonuclar.length === 0 && (
                <Typography>Henüz test çözülmemiş.</Typography>
            )}

            <Stack spacing={2}>
                {sonuclar.map((s, i) => (

                        <Paper
                            key={i}
                            sx={{ p: 2, cursor: 'pointer' }}
                            onClick={() => handleOpenDetail(s)}
                        >

                            <Typography fontWeight="bold">{s.testId?.baslik}</Typography>
                            <Typography>Puan: {s.puan}</Typography>
                            <Typography>Geri Bildirim: {s.geribildirim}</Typography>
                            <Typography color="text.secondary">
                                {new Date(s.tarih).toLocaleString()}
                            </Typography>

                        </Paper>


                ))}
            </Stack>
            <Dialog open={acik} onClose={() => setAcik(false)} maxWidth="md" fullWidth>
                <DialogTitle>{seciliSonuc?.testId?.baslik} – Detaylı Çözüm</DialogTitle>
                <DialogContent>
                    {seciliSonuc?.testSorulari && (
                        <Box mt={2} mb={4}>
                            <Typography variant="subtitle1">Doğru / Yanlış Dağılımı</Typography>
                            <PieChart width={300} height={250}>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={renkler[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </Box>
                    )}
                    {seciliSonuc?.testSorulari?.map((soru: any, index: number) => {
                        const ogrCevap = seciliSonuc.cevaplar[index];
                        const dogruMu = ogrCevap === soru.cevap;

                        return (
                            <Box
                                key={index}
                                mt={2}
                                p={2}
                                bgcolor={dogruMu ? '#e6f7e6' : '#ffebee'}
                                borderRadius={1}
                            >
                                <Typography>
                                    <strong>Soru {index + 1}:</strong> {soru.icerik}
                                </Typography>
                                <Typography>
                                    <strong>Verdiğin Cevap:</strong> {ogrCevap} {dogruMu ? '✅' : '❌'}
                                </Typography>
                                {!dogruMu && (
                                    <Typography>
                                        <strong>Doğru Cevap:</strong> {soru.cevap}
                                    </Typography>
                                )}


                            </Box>
                        );
                    })}

                </DialogContent>
            </Dialog>

        </Box>
    );
};

export default MyResultsPage;
