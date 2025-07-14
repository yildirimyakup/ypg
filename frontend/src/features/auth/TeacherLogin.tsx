import {
    Box, Button, Container, TextField, Typography, Alert
} from '@mui/material';
import { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from "../../context/AuthContext.tsx";

const TeacherLogin = () => {
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [hata, setHata] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                sifre,
                rol: 'ogretmen'
            });


            login(res.data.token,res.data.kullanici.rol,res.data.kullanici.ad,res.data.kullanici.id);
            console.log(res.data.kullanici.id);
            navigate('/dashboard/ogretmen');
        } catch (err: any) {
            setHata(err.response?.data?.mesaj || 'Giriş başarısız');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Typography variant="h4" gutterBottom>Öğretmen Girişi</Typography>

            {hata && <Alert severity="error">{hata}</Alert>}

            <Box mt={3} display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Şifre"
                    type="password"
                    fullWidth
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleLogin}>
                    Giriş Yap
                </Button>
                <Typography>
                    Hesabınız yok mu? <Link to="/register/ogretmen">Kayıt Ol</Link>
                </Typography>

            </Box>
        </Container>
    );
};

export default TeacherLogin;
