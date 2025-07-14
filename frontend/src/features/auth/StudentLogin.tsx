import {
    Box, Button, Container, TextField, Typography, Alert
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from "../../context/AuthContext.tsx";

const StudentLogin = () => {
    const [kod, setKod] = useState('');
    const [hata, setHata] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', {
                email: 'empty',
                sifre: kod, // backend'de "kod" alanı sifreHash ile eşleşiyor
                rol: 'ogrenci'
            });

            if (res.data.kullanici.rol !== 'ogrenci') {
                setHata('Bu giriş sadece öğrencilere özeldir.');
                return;
            }
            login(res.data.token,res.data.kullanici.rol,res.data.kullanici.ad,res.data.kullanici.id);
            localStorage.setItem("sinifId",res.data.kullanici.sinifId);

            navigate('/dashboard/ogrenci');
        } catch (err: any) {
            setHata(err.response?.data?.mesaj || 'Giriş başarısız');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Typography variant="h4" gutterBottom>Öğrenci Girişi</Typography>

            {hata && <Alert severity="error">{hata}</Alert>}

            <Box mt={3} display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Giriş Kodu"
                    type="text"
                    fullWidth
                    value={kod}
                    onChange={(e) => setKod(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleLogin}>
                    Giriş Yap
                </Button>
            </Box>
        </Container>
    );
};

export default StudentLogin;
