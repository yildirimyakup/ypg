import {
    Box,
    Typography,
    Paper,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    Divider, IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import ClearIcon from "@mui/icons-material/Clear";

const renkler = ['#4caf50', '#f44336']; // Doğru, Yanlış

const MyResultsPage = () => {
    const [sonuclar, setSonuclar] = useState<any[]>([]);
    const [acik, setAcik] = useState(false);
    const [seciliSonuc, setSeciliSonuc] = useState<any | null>(null);

    const token = localStorage.getItem('token');
    const ogrenciId = localStorage.getItem('id');

    const fetchResults = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/results/student/${ogrenciId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSonuclar(res.data);
        } catch (err) {
            console.error('Sonuçlar alınamadı.', err);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleOpenDetail = (sonuc: any) => {
        setSeciliSonuc(sonuc);
        setAcik(true);
    };

    const handleCloseDialog = () => {
        setSeciliSonuc(null);
        setAcik(false);
    };

    const dogruSayisi = seciliSonuc?.testSorulari?.reduce((count: number, soru: any, i: number) => {
        return seciliSonuc.cevaplar[i] === soru.cevap ? count + 1 : count;
    }, 0) ?? 0;

    const yanlisSayisi = seciliSonuc?.testSorulari?.length - dogruSayisi ;

    const chartData = [
        { name: 'Doğru', value: dogruSayisi },
        { name: 'Yanlış', value: yanlisSayisi }
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'cursive', color: '#1e3d2f' }}>
                Geçmiş Test Sonuçlarım
            </Typography>

            {sonuclar.length === 0 ? (
                <Typography>Henüz test çözülmemiş.</Typography>
            ) : (
                <Stack spacing={3}>
                    {sonuclar.map((s, i) => (
                        <Paper
                            key={i}
                            elevation={4}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.015)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                    background: 'linear-gradient(135deg, #bbdefb, #ffffff)'
                                }
                            }}
                            onClick={() => handleOpenDetail(s)}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6" fontWeight="bold" color="primary.dark" sx={{ fontFamily: 'cursive' }}>
                                    {s.testId?.baslik}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(s.tarih).toLocaleString()}
                                </Typography>
                            </Box>

                            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body1">
                                    🎯 Puan: <strong>{s.puan}</strong>
                                </Typography>
                                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                    💬 {s.geribildirim}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Stack>

            )}

            {/* Detaylı Çözüm Diyaloğu */}
            <Dialog
                open={acik}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 'bold',display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center" }}>
                    <Typography>{seciliSonuc?.testId?.baslik} – Çözüm Detayı </Typography>
                    <IconButton  onClick={() => {handleCloseDialog();}}color="error">
                        <ClearIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle1" gutterBottom>
                        Puan: <strong>{seciliSonuc?.puan}</strong>
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        <Typography variant={"h5"}>Geri Bildirim:</Typography> {seciliSonuc?.geribildirim}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <PieChart width={320} height={250}>
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
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Soruların Detayı */}
                    {seciliSonuc?.testSorulari?.map((soru: any, index: number) => {
                        const ogrCevap = seciliSonuc.cevaplar[index];
                        const dogruMu = ogrCevap === soru.cevap;

                        return (
                            <Paper
                                key={index}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: dogruMu ? '#e6f7e6' : '#ffebee',
                                    borderLeft: `6px solid ${dogruMu ? '#4caf50' : '#f44336'}`
                                }}
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
                            </Paper>
                        );
                    })}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default MyResultsPage;
