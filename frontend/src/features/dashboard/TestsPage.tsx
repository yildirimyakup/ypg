import {
    Box, Button, TextField, Typography, MenuItem, Paper, Stack, Alert,
    Select, InputLabel, FormControl, IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

interface ClassData {
    _id: string;
    ad: string;
}

interface Soru {
    tip: 'coktan_secmeli' | 'dogru_yanlis';
    icerik: string;
    secenekler?: string[];
    cevap: string;
}

const TestsPage = () => {
    const [baslik, setBaslik] = useState('');
    const [sinifId, setSinifId] = useState('');
    const [sorular, setSorular] = useState<Soru[]>([]);
    const [siniflar, setSiniflar] = useState<ClassData[]>([]);
    const [testler, setTestler] = useState<any[]>([]);
    const [mesaj, setMesaj] = useState('');
    const [hata, setHata] = useState('');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/classes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSiniflar(res.data);
        } catch {
            setHata('Sınıflar alınamadı');
        }
    };

    const fetchTests = async (classId: string) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/tests/class/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTestler(res.data);
        } catch {
            setHata('Testler alınamadı');
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (sinifId) fetchTests(sinifId);
    }, [sinifId]);

    const addSoru = () => {
        setSorular([...sorular, {
            tip: 'coktan_secmeli',
            icerik: '',
            secenekler: ['', '', '', ''],
            cevap: ''
        }]);
    };

    const handleRemoveSoru = (index: number) => {
        const yeni = [...sorular];
        yeni.splice(index, 1);
        setSorular(yeni);
    };

    const handleSoruChange = (index: number, field: keyof Soru, value: any) => {
        const updated = [...sorular];
        updated[index][field] = value;
        setSorular(updated);
    };

    const handleSecenekChange = (soruIndex: number, secenekIndex: number, value: string) => {
        const updated = [...sorular];
        updated[soruIndex].secenekler![secenekIndex] = value;
        setSorular(updated);
    };

    const handleSubmit = async () => {
        if (!baslik || !sinifId) return setHata('Başlık ve sınıf seçmelisiniz.');
        if (sorular.length === 0) return setHata('En az bir soru eklemelisiniz.');

        try {
            const soruIdListesi = [];
            for (const soru of sorular) {
                const res = await axios.post('http://localhost:3000/api/tests/question', soru, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                soruIdListesi.push(res.data._id);
            }

            await axios.post('http://localhost:3000/api/tests/create', {
                baslik,
                ogretmenId:id,
                soruIdListesi,
                atananSinifId: sinifId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMesaj('Test oluşturuldu');
            setBaslik('');
            setSinifId('');
            setSorular([]);
            fetchTests(sinifId);
        } catch {
            setHata('Test oluşturulamadı');
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Test Oluştur</Typography>

            {mesaj && <Alert severity="success">{mesaj}</Alert>}
            {hata && <Alert severity="error">{hata}</Alert>}

            <Stack spacing={2} mb={3}>
                <TextField
                    label="Test Başlığı"
                    value={baslik}
                    onChange={(e) => setBaslik(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel>Sınıf Seç</InputLabel>
                    <Select
                        value={sinifId}
                        label="Sınıf Seç"
                        onChange={(e) => setSinifId(e.target.value)}
                    >
                        {siniflar.map((s) => (
                            <MenuItem key={s._id} value={s._id}>{s.ad}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {sorular.map((soru, i) => (
                <Paper key={i} sx={{ p: 2, mb: 2, position: 'relative' }}>
                    <IconButton
                        onClick={() => handleRemoveSoru(i)}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <DeleteIcon />
                    </IconButton>

                    <Typography variant="subtitle1">Soru {i + 1}</Typography>
                    <TextField
                        label="Soru Metni"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={soru.icerik}
                        onChange={(e) => handleSoruChange(i, 'icerik', e.target.value)}
                    />
                    {soru.tip === 'coktan_secmeli' && soru.secenekler?.map((sec, j) => (
                        <TextField
                            key={j}
                            label={`Seçenek ${String.fromCharCode(65 + j)}`}
                            value={sec}
                            onChange={(e) => handleSecenekChange(i, j, e.target.value)}
                            sx={{ mr: 2, mt: 1 }}
                        />
                    ))}
                    <TextField
                        label="Doğru Cevap"
                        value={soru.cevap}
                        onChange={(e) => handleSoruChange(i, 'cevap', e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </Paper>
            ))}

            <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={addSoru}>
                    + Soru Ekle
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Testi Kaydet
                </Button>
            </Stack>

            {testler.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Oluşturulmuş Testler</Typography>
                    {testler.map(test => (
                        <Paper key={test._id} sx={{ p: 2, mb: 2 }}>
                            <Typography fontWeight="bold">{test.baslik}</Typography>
                            <ul>
                                {test.soruListesi.map((soru: any, i: number) => (
                                    <li key={i}>{soru.icerik} (Cevap: {soru.cevap})</li>
                                ))}
                            </ul>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default TestsPage;
