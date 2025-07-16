import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert
} from '@mui/material';
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
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
        <Container
            maxWidth="sm"
            sx={{
                mt: 10,
                backgroundColor: 'transparent',
                color: 'white',
                padding: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: 'white' ,fontFamily: ' cursive'}}>
                ÖĞRETMEN KAYIT
            </Typography>

            {uyari && <Alert severity="warning">{uyari}</Alert>}
            {hata && <Alert severity="error">{hata}</Alert>}

            <Box mt={3} display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Adınız"
                    value={ad}
                    onChange={(e) => setAd(e.target.value)}
                    fullWidth
                    InputLabelProps={{ style: { color: 'white' } }}
                    InputProps={{ style: { color: 'white' } }}
                    sx={{
                        '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#ffffffaa' },
                        '& .MuiInput-underline:after': { borderBottomColor: 'white' },
                    }}
                    variant="standard"
                />

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    InputLabelProps={{ style: { color: 'white' } }}
                    InputProps={{ style: { color: 'white' } }}
                    sx={{
                        '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#ffffffaa' },
                        '& .MuiInput-underline:after': { borderBottomColor: 'white' },
                    }}
                    variant="standard"
                />

                <TextField
                    label="Şifre"
                    type="password"
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                    fullWidth
                    InputLabelProps={{ style: { color: 'white' } }}
                    InputProps={{ style: { color: 'white' } }}
                    sx={{
                        '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#ffffffaa' },
                        '& .MuiInput-underline:after': { borderBottomColor: 'white' },
                    }}
                    variant="standard"
                />

                <TextField
                    label="Şifre (Tekrar)"
                    type="password"
                    value={sifreTekrar}
                    onChange={(e) => setSifreTekrar(e.target.value)}
                    fullWidth
                    InputLabelProps={{ style: { color: 'white' } }}
                    InputProps={{ style: { color: 'white' } }}
                    sx={{
                        '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#ffffffaa' },
                        '& .MuiInput-underline:after': { borderBottomColor: 'white' },
                    }}
                    variant="standard"
                />

                <Button variant="contained" color="primary" onClick={handleRegister}>
                    Kayıt Ol
                </Button>
            </Box>
            <Typography sx={{ margin:3,color: 'white',textAlign: 'end' ,fontFamily: ' cursive',}}>

                <Link to="/login/ogretmen" style={{ color: '#90caf9' }}>
                   Giriş Yap
                </Link>
            </Typography>
        </Container>
    );
};

export default TeacherRegister;
