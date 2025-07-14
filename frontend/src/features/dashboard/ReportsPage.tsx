import {
    Box, Typography, Select, MenuItem, InputLabel, FormControl,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, Stack
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ClassData {
    _id: string;
    ad: string;
}

const ReportsPage = () => {
    const token = localStorage.getItem('token');
    const ogretmenId = localStorage.getItem('id');
    const [siniflar, setSiniflar] = useState<ClassData[]>([]);
    const [seciliSinif, setSeciliSinif] = useState('');
    const [raporlar, setRaporlar] = useState<any[]>([]);
    const [sinifOrt, setSinifOrt] = useState<number | null>(null);

    const [seciliOgrenciAd, setSeciliOgrenciAd] = useState('');
    const [testSonuclari, setTestSonuclari] = useState<any[]>([]);
    const [modalAcik, setModalAcik] = useState(false);

    const fetchClasses = async () => {
        const res = await axios.get(`http://localhost:3000/api/classes/${ogretmenId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSiniflar(res.data);
    };

    const fetchReport = async (classId: string) => {
        const res = await axios.get(`http://localhost:3000/api/reports/class/${classId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setRaporlar(res.data.ogrenciler); // ogrenciAd, ogrenciId, ortalama, testSayisi
        setSinifOrt(res.data.sinifOrtalamasi);
    };

    const fetchTestResults = async (ogrenciId: string, ogrenciAd: string) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/results/student/${ogrenciId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSeciliOgrenciAd(ogrenciAd);
            setTestSonuclari(res.data);
            setModalAcik(true);
        } catch {
            console.error('Test sonuçları alınamadı.');
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (seciliSinif) fetchReport(seciliSinif);
    }, [seciliSinif]);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Raporlama ve Takip</Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Sınıf Seç</InputLabel>
                <Select
                    value={seciliSinif}
                    label="Sınıf Seç"
                    onChange={(e) => setSeciliSinif(e.target.value)}
                >
                    {siniflar.map((s) => (
                        <MenuItem key={s._id} value={s._id}>{s.ad}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {raporlar.length > 0 && (
                <>
                    <Typography variant="subtitle1" gutterBottom>
                        Sınıf Ortalaması: <strong>{sinifOrt}</strong>
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Öğrenci</TableCell>
                                    <TableCell>Test Sayısı</TableCell>
                                    <TableCell>Ortalama Puan</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {raporlar.map((ogr, i) => (
                                    <TableRow key={i}>
                                        <TableCell
                                            onClick={() => fetchTestResults(ogr.ogrenciId, ogr.ogrenciAd)}
                                            sx={{
                                                cursor: 'pointer',
                                                color: 'primary.main',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            {ogr.ogrenciAd}
                                        </TableCell>
                                        <TableCell>{ogr.testSayisi}</TableCell>
                                        <TableCell>{ogr.ortalama}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {/* Modal: Öğrenci Test Sonuçları ve Detayları */}
            <Dialog open={modalAcik} onClose={() => setModalAcik(false)} maxWidth="md" fullWidth>
                <DialogTitle>{seciliOgrenciAd} – Test Sonuçları</DialogTitle>
                <DialogContent>
                    {testSonuclari.length === 0 ? (
                        <Typography>Test sonucu bulunamadı.</Typography>
                    ) : (
                        <Stack spacing={2}>
                            {testSonuclari.map((s, i) => (
                                <Paper key={i} sx={{ p: 2 }}>
                                    <Typography fontWeight="bold">{s.testId?.baslik}</Typography>
                                    <Typography>Puan: {s.puan}</Typography>
                                    <Typography>Geri Bildirim: {s.geribildirim}</Typography>
                                    <Typography color="text.secondary">
                                        {new Date(s.tarih).toLocaleString()}
                                    </Typography>

                                    {/* Soru detayları */}
                                    {s.testSorulari?.map((soru: any, index: number) => {
                                        const ogrCevap = s.cevaplar[index];
                                        const dogruMu = ogrCevap === soru.cevap;

                                        return (
                                            <Box key={index} mt={2} p={2} bgcolor={dogruMu ? '#e6f7e6' : '#ffebee'} borderRadius={1}>
                                                <Typography><strong>Soru {index + 1}:</strong> {soru.icerik}</Typography>
                                                <Typography><strong>Verilen Cevap:</strong> {ogrCevap} {dogruMu ? '✅' : '❌'}</Typography>
                                                {!dogruMu && (
                                                    <Typography><strong>Doğru Cevap:</strong> {soru.cevap}</Typography>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ReportsPage;
