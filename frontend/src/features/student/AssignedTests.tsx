import {
    Box, Button, Typography, Paper, Stack
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.tsx";

const AssignedTests = () => {
    const [testler, setTestler] = useState<any[]>([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const {id} =useAuth(); // öğrenci login sonrası

    const fetchTests = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/results/student/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // daha önce çözülmemiş testleri filtrele (opsiyonel)
            const cozulmusTestIdler = res.data.map((r: any) => r.testId._id);

            const sinifId = localStorage.getItem('sinifId');
            const res2 = await axios.get(`http://localhost:3000/api/tests/class/${sinifId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const atanmis = res2.data.filter((t: any) => !cozulmusTestIdler.includes(t._id));
            setTestler(atanmis);
        } catch (err) {
            console.error('Testler alınamadı.');
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Atanmış Testler</Typography>

            {testler.length === 0 && <Typography>Şu anda çözülmemiş testiniz yok.</Typography>}

            <Stack spacing={2}>
                {testler.map((test) => (
                    <Paper key={test._id} sx={{ p: 2 }}>
                        <Typography fontWeight="bold">{test.baslik}</Typography>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/dashboard/ogrenci/solve/${test._id}`)}
                            sx={{ mt: 1 }}
                        >
                            Testi Çöz
                        </Button>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
};

export default AssignedTests;
