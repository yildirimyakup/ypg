import {
    Box, Button, Typography, Paper, Stack
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';

const AssignedTests = () => {
    const [testler, setTestler] = useState<any[]>([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { id } = useAuth(); // öğrenci ID
    const sinifId = localStorage.getItem('sinifId'); // localStorage'dan sınıfId

    const fetchTests = async () => {
        try {
            // Çözülen testler
            const resResults = await axios.get(`http://localhost:3000/api/results/student/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const cozulmusTestIdler = resResults.data.map((r: any) => r.testId._id);

            // Atanmış ve yayınlanmış testler
            const resTests = await axios.get(`http://localhost:3000/api/tests/class/${sinifId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Sadece çözülmemiş olanları filtrele
            const atanmis = resTests.data.filter((t: any) => !cozulmusTestIdler.includes(t._id));
            setTestler(atanmis);
        } catch (err) {
            console.error('Testler alınamadı.', err);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{fontFamily:"cursive" , color:"primary.main"}}>ÇÖZÜLMEMİŞ TESTLERİM</Typography>

            {testler.length === 0 ? (
                <Paper
                    elevation={2}
                    sx={{
                        mt: 4,
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 3,
                        backgroundColor: '#f9fbe7',
                        border: '1px dashed #cddc39'
                    }}
                >
                    <Typography variant="h4" color="text.secondary" gutterBottom>
                        📭 Test Yok
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Şu anda çözülmemiş herhangi bir testiniz bulunmuyor.
                    </Typography>
                    <Typography variant="body2" color="text.disabled" mt={1}>
                        Yeni testler öğretmeniniz tarafından tanımlandığında burada görünecek.
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={3}>
                    {testler.map((test) => (
                        <Paper
                            key={test._id}
                            elevation={4}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #f0f4c3, #ffffff)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'scale(1.015)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                    background: 'linear-gradient(135deg, #e6ee9c, #ffffff)'
                                }
                            }}
                        >
                            <Typography
                                variant="h6"
                                color="primary"
                                fontWeight="bold"
                                sx={{ fontFamily: 'cursive', mb: 1 }}
                            >
                                📘 {test.baslik}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                Test size atanmıştır. Uygun olduğunuzda çözebilirsiniz.
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    bgcolor: '#1e3d2f',
                                    '&:hover': { bgcolor: '#2e5941' }
                                }}
                                onClick={() => navigate(`/dashboard/ogrenci/solve/${test._id}`)}
                            >
                                Testi Çöz
                            </Button>
                        </Paper>
                    ))}
                </Stack>
            )}

        </Box>
    );
};

export default AssignedTests;
