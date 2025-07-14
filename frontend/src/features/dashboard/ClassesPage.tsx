import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Stack,
    List,
    ListItem,
    ListItemText,
    Alert
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useAuth} from "../../context/AuthContext.tsx";

interface ClassData {
    _id: string;
    ad: string;
}

const ClassesPage = () => {
    const [sinifAd, setSinifAd] = useState('');
    const [siniflar, setSiniflar] = useState<ClassData[]>([]);
    const [mesaj, setMesaj] = useState('');
    const [hata, setHata] = useState('');
    const [aktifSinifId, setAktifSinifId] = useState<string | null>(null);
    const [ogrAd, setOgrAd] = useState('');
    const [ogrEmail, setOgrEmail] = useState('');
    const [eklenenKod, setEklenenKod] = useState('');

    const token = localStorage.getItem('token');
    const {id} = useAuth();
    const ogretmenId = id;

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/classes/${ogretmenId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSiniflar(res.data);
        } catch {
            setHata('Sınıflar alınamadı.');
        }
    };

    const handleCreateClass = async () => {
        if (!sinifAd) return;

        try {
            await axios.post(
                'http://localhost:3000/api/classes/create',
                { ad: sinifAd,ogretmenId},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMesaj('Sınıf oluşturuldu.');
            setSinifAd('');
            fetchClasses();
        } catch {
            setHata('Sınıf oluşturulamadı.');
        }
    };

    const handleAddStudent = async (classId: string) => {
        try {
            const res = await axios.put(
                `http://localhost:3000/api/classes/${classId}/add`,
                { ad: ogrAd, email: ogrEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEklenenKod(res.data.ogrenci.kod);
            setOgrAd('');
            setOgrEmail('');
            fetchClasses();
        } catch (err) {
            setHata('Öğrenci eklenemedi.');
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Sınıflar</Typography>

            {mesaj && <Alert severity="success">{mesaj}</Alert>}
            {hata && <Alert severity="error">{hata}</Alert>}

            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <TextField
                    label="Sınıf Adı"
                    value={sinifAd}
                    onChange={(e) => setSinifAd(e.target.value)}
                />
                <Button variant="contained" onClick={handleCreateClass}>
                    Oluştur
                </Button>
            </Stack>

            <Paper elevation={2} sx={{ p: 2 }}>
                <List>
                    {siniflar.map((s) => (
                        <Box key={s._id}>
                            <ListItem
                                secondaryAction={
                                    <Button
                                        variant="text"
                                        onClick={() =>
                                            setAktifSinifId(s._id === aktifSinifId ? null : s._id)
                                        }
                                    >
                                        {aktifSinifId === s._id ? 'Formu Gizle' : 'Öğrenci Ekle'}
                                    </Button>
                                }
                            >
                                <ListItemText primary={s.ad} />
                            </ListItem>

                            {aktifSinifId === s._id && (
                                <Box mt={2} mb={2} pl={2}>
                                    <TextField
                                        label="Öğrenci Adı"
                                        value={ogrAd}
                                        onChange={(e) => setOgrAd(e.target.value)}
                                        sx={{ mr: 2 }}
                                    />
                                    <TextField
                                        label="Öğrenci Email"
                                        value={ogrEmail}
                                        onChange={(e) => setOgrEmail(e.target.value)}
                                        sx={{ mr: 2 }}
                                    />
                                    <Button variant="outlined" onClick={() => handleAddStudent(s._id)}>
                                        Ekle
                                    </Button>
                                    {eklenenKod && (
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            Giriş Kodu: <strong>{eklenenKod}</strong>
                                        </Alert>
                                    )}
                                </Box>
                            )}
                        </Box>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default ClassesPage;
