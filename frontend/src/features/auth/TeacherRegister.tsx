import {
    Box, Button, Container, TextField, Typography, Alert
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherRegister = () => {
    const [ad, setAd] = useState('');
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [sifreTekrar, setSifreTekrar] = useState('');
    const [hata, setHata] = useState('');
    const [uyari, setUyari] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 6;
        // Daha gelişmiş kontrol:
        // return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
    };

    const handleRegister = async () => {
        setHata('');
        setUyari('');

        if (!ad || !email || !sifre || !sifreTekrar) {
            setUyari('Lütfen tüm alanları doldurun.');
            return;
        }

        if (!validateEmail(email)) {
            setUyari('Geçerli bir email adresi girin.');
            return;
        }

        if (!validatePassword(sifre)) {
            setUyari('Şifre en az 6 karakter olmalı.');
            return;
        }

        if (sifre !== sifreTekrar) {
            setUyari('Şifreler uyuşmuyor.');
            return;
        }

        try {
            await axios.post('http://localhost:3000/api/auth/register', {
                ad,
                email,
                sifre,
                rol: 'ogretmen'
            });

            navigate('/login/ogretmen');
        } catch (err: any) {
            setHata(err.response?.data?.mesaj || 'Kayıt başarısız.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Typography variant="h4" gutterBottom>Öğretmen Kayıt</Typography>

            {uyari && <Alert severity="warning">{uyari}</Alert>}
            {hata && <Alert severity="error">{hata}</Alert>}

            <Box mt={3} display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Adınız"
                    value={ad}
                    onChange={(e) => setAd(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Şifre"
                    type="password"
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Şifre (Tekrar)"
                    type="password"
                    value={sifreTekrar}
                    onChange={(e) => setSifreTekrar(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleRegister}>
                    Kayıt Ol
                </Button>
            </Box>
        </Container>
    );
};

export default TeacherRegister;
