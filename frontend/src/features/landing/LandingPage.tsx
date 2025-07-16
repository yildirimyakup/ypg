import { Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minWidth:"700px",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight:"500px",
                justifyContent: 'center',
                height: '100%', // ChalkboardFrame'in yüksekliğini doldur
                textAlign: 'center',
                px: 4, // mobilde kenarlardan boşluk
            }}
        >
            <Box
                component="img"
                src={logo}
                alt="Platform Logo"
                sx={{
                    width: 200,
                    mb: 4,
                    objectFit: 'contain',
                    backgroundColor: 'transparent',
                    borderRadius: 200,
                }}
            />
            <Box sx={{ mb: 2, fontSize: '1.1rem', color: '#fff' }}>
                Giriş yapmak için lütfen rolünüzü seçin
            </Box>

            <Stack spacing={2} mt={2} width="100%" maxWidth={300}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/login/ogretmen')}
                >
                    Öğretmen Girişi
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/login/ogrenci')}
                >
                    Öğrenci Girişi
                </Button>
            </Stack>
        </Box>
    );
};

export default LandingPage;
