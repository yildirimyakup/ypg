// Yeni TestsPage.tsx
import {
    Box,
    Typography,
    TextField,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    Chip,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Switch,
    FormControlLabel,
    Alert,
    ButtonGroup
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { QuestionFormKomponents } from "./components/tests/QuestionFormKomponents.tsx";
import { NewQuestionFormComponent } from "./components/tests/NewQuestionFormCompenent.tsx";
import { QuestionCardComponent } from "./components/tests/QuestionCardComponent.tsx";

interface Soru {
    _id?: string;
    icerik: string;
    cevap: string;
    secenekler?: string[];
    tip: 'coktan_secmeli' | 'dogru_yanlis';
}

interface Test {
    _id: string;
    baslik: string;
    soruListesi: Soru[];
    atananSiniflar: string[];
    yayinDurumu: boolean;
    yayinZamani?: string;
}

interface Sinif {
    _id: string;
    ad: string;
}

const TestsPage = () => {
    const [testler, setTestler] = useState<Test[]>([]);
    const [search, setSearch] = useState('');
    const [aktifTestId, setAktifTestId] = useState<string | null>(null);
    const [siniflar, setSiniflar] = useState<Sinif[]>([]);
    const [hata, setHata] = useState('');
    const [mesaj, setMesaj] = useState('');
    const [newQuestionOpen, setNewQuestionOpen] = useState<string | null>(null);
    const [eklenecekSoru, setEklenecekSoru] = useState<Soru>({
        tip: 'coktan_secmeli',
        icerik: '',
        secenekler: ['', '', '', ''],
        cevap: ''
    });
    const [yeniBaslik, setYeniBaslik] = useState('');
    const [yeniSorular, setYeniSorular] = useState<Soru[]>([]);
    const [sorularAcik, setSorularAcik] = useState<boolean>(false);
    const [editedTests, setEditedTests] = useState<{ [key: string]: Partial<Test> }>({});

    const token = localStorage.getItem('token');
    const ogretmenId = localStorage.getItem('id');

    const fetchTests = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/tests/teacher/${ogretmenId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTestler(res.data);
        } catch {
            setHata('Testler alınamadı');
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/classes/${ogretmenId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSiniflar(res.data);
        } catch {
            setHata('Sınıflar alınamadı');
        }
    };

    useEffect(() => {
        fetchTests();
        fetchClasses();
    }, []);

    const filtrelenmisTestler = testler.filter(t => t.baslik.toLowerCase().includes(search.toLowerCase()));

    const handleTestUpdate = async (testId: string) => {
        const update = editedTests[testId];
        if (!update) return;

        try {
            await axios.put(`http://localhost:3000/api/tests/${testId}`, update, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMesaj("Test güncellendi.");
            fetchTests();
        } catch {
            setHata("Test güncellenemedi.");
        }
    };

    const handleTestDelete = async (testId: string) => {
        try {
            await axios.delete(`http://localhost:3000/api/tests/${testId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMesaj("Test silindi.");
            fetchTests();
        } catch {
            setHata("Test silinemedi.");
        }
    };

    const addSoru = () => {
        setYeniSorular(prev => [...prev, {
            tip: 'coktan_secmeli',
            icerik: '',
            secenekler: ['', '', '', ''],
            cevap: ''
        }]);
    };

    const handleQuestionDelete = async (questionId: string) => {
        try {
            await axios.delete(`http://localhost:3000/api/tests/question/${questionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMesaj("Soru silindi.");
            fetchTests();
        } catch {
            setHata("Soru silinemedi.");
        }
    };

    const handleYeniTestOlustur = async () => {
        if (!yeniBaslik || yeniSorular.length === 0) {
            setHata("Başlık ve en az bir soru zorunludur.");
            return;
        }

        try {
            const soruIdListesi = [];
            for (const soru of yeniSorular) {
                const res = await axios.post('http://localhost:3000/api/tests/question', soru, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                soruIdListesi.push(res.data._id);
            }

            await axios.post('http://localhost:3000/api/tests/create', {
                baslik: yeniBaslik,
                ogretmenId,
                soruIdListesi
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMesaj('Yeni test oluşturuldu.');
            setYeniBaslik('');
            setYeniSorular([]);
            fetchTests();
        } catch {
            setHata("Test oluşturulamadı.");
        }
    };

    const handleSoruEkle = async (testId: string) => {
        if (!eklenecekSoru.icerik || !eklenecekSoru.cevap) return;

        try {
            const res = await axios.post('http://localhost:3000/api/tests/question', eklenecekSoru, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await axios.put(`http://localhost:3000/api/tests/${testId}/add-question`, {
                questionId: res.data._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMesaj("Soru eklendi.");
            setEklenecekSoru({ tip: 'coktan_secmeli', icerik: '', secenekler: ['', '', '', ''], cevap: '' });
            fetchTests();
        } catch (err) {
            setHata("Soru eklenemedi.");
        }
    };

    return (
        <Box>
            {mesaj && <Alert severity="success">{mesaj}</Alert>}
            {hata && <Alert severity="error">{hata}</Alert>}

            <Box sx={{ border: "0.5px solid green", padding: "10px", marginTop: "15px", marginBottom: "10px", borderRadius: "5px", background: "white" }}>
                <Typography variant="h3" sx={{ fontFamily: "cursive", color: "#1e3d2f" }} gutterBottom>TESTLERİM</Typography>
                <Stack direction="column" spacing={2} alignItems="center" mb={3}>
                    <TextField fullWidth label="Test Başlığı" value={yeniBaslik} onChange={(e) => setYeniBaslik(e.target.value)} sx={{ mb: 2 }} />
                    {yeniSorular.map((soru, i) => (
                        <QuestionFormKomponents i={i} setYeniSorular={setYeniSorular} yeniSorular={yeniSorular} soru={soru} key={i} />
                    ))}
                    <ButtonGroup variant={"outlined"} sx={{ width: "100%" }}>
                        <Button variant="outlined" onClick={addSoru} >+ Soru Ekle</Button>
                        <Button variant="contained" onClick={handleYeniTestOlustur}>Testi Kaydet</Button>
                    </ButtonGroup>
                </Stack>
            </Box>

            <TextField
                fullWidth
                label="Test Ara"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 3 }}
            />

            {filtrelenmisTestler.map(test => (
                <Accordion key={test._id} expanded={aktifTestId === test._id} onChange={() => setAktifTestId(prev => prev === test._id ? null : test._id)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ flexGrow: 1 }}>{test.baslik}</Typography>
                        <Chip label={test.yayinDurumu ? 'Yayında' : 'Taslak'} color={test.yayinDurumu ? 'success' : 'default'} />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={2}>
                            <TextField label="Test Başlığı" defaultValue={test.baslik} fullWidth onChange={(e) => {
                                setEditedTests(prev => ({ ...prev, [test._id]: { ...prev[test._id], baslik: e.target.value } }));
                            }} />

                            <FormControl fullWidth>
                                <InputLabel>Sınıflar</InputLabel>

                                <Select multiple defaultValue={test.atananSiniflar} onChange={(e) => {
                                    const value = e.target.value;
                                    setEditedTests(prev => ({ ...prev, [test._id]: { ...prev[test._id], atananSiniflar: value as string[] } }));
                                }}>
                                    {siniflar.map(s => (
                                        <MenuItem key={s._id} value={s._id}>{s.ad}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControlLabel control={<Switch defaultChecked={test.yayinDurumu} onChange={(e) => {
                                setEditedTests(prev => ({ ...prev, [test._id]: { ...prev[test._id], yayinDurumu: e.target.checked } }));
                            }} />} label="Yayında mı?" />

                            <ButtonGroup variant={"outlined"} fullWidth>
                                <Button variant="outlined" sx={{color:"hotpink",borderColor:"hotpink"}} startIcon={!sorularAcik ? <KeyboardArrowDownIcon /> :<KeyboardArrowUpIcon/>} onClick={() => {sorularAcik ? setSorularAcik(false):setSorularAcik(true)}}>Soruları Göster</Button>
                                <Button variant="outlined" color="info" startIcon={<AddIcon />} onClick={() => setNewQuestionOpen(test._id)}>Yeni Soru Ekle</Button>
                                <Button variant="outlined" startIcon={<SaveIcon />} onClick={() => handleTestUpdate(test._id)}>Kaydet</Button>
                                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleTestDelete(test._id)}>Sil</Button>
                            </ButtonGroup>

                            <NewQuestionFormComponent
                                id={test._id}
                                open={newQuestionOpen === test._id}
                                onClose={() => setNewQuestionOpen(null)}
                                eklenecekSoru={eklenecekSoru}
                                setEklenecekSoru={setEklenecekSoru}
                                handleSoruEkle={handleSoruEkle}
                            />


                            {sorularAcik && (
                                test.soruListesi.map((soru, i) => (
                                        <QuestionCardComponent key={soru._id || i} soru={soru} index={i} handleQuestionDelete={handleQuestionDelete} />
                                    ))
                            )}


                        </Stack>
                    </AccordionDetails>
                </Accordion>
            ))}

        </Box>
    );
};

export default TestsPage;
