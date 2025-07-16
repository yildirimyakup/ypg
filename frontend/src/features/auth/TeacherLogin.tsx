import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.tsx';

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

            login(res.data.token, res.data.kullanici.rol, res.data.kullanici.ad, res.data.kullanici.id);
            navigate('/dashboard/ogretmen');
        } catch (err: any) {
            setHata(err.response?.data?.mesaj || 'Giriş başarısız');
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
            <Typography
                variant="h4"
                sx={{ textAlign: 'center', color: 'white',fontFamily: ' cursive' }}
                gutterBottom
            >
                ÖĞRETMEN GİRİŞİ
            </Typography>

            {hata && <Alert severity="error">{hata}</Alert>}

            <Box mt={3} display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    InputProps={{
                        style: { color: 'white' },
                    }}
                    sx={{
                        '& .MuiInput-underline:before': {
                            borderBottomColor: 'white',
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottomColor: '#ffffffaa',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: 'white',
                        },
                    }}
                    variant="standard"
                />

                <TextField
                    label="Şifre"
                    type="password"
                    fullWidth
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    InputProps={{
                        style: { color: 'white' },
                    }}
                    sx={{
                        '& .MuiInput-underline:before': {
                            borderBottomColor: 'white',
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                            borderBottomColor: '#ffffffaa',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: 'white',
                        },
                    }}
                    variant="standard"
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                >
                    Giriş Yap
                </Button>

                <Typography sx={{ margin:3,color: 'white',textAlign: 'end' ,fontFamily: ' cursive',}}>
                    Hesabınız yok mu?{' '}
                    <Link to="/register/ogretmen" style={{ color: '#90caf9' }}>
                        Kayıt Ol
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default TeacherLogin;
