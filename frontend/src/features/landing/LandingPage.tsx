import { Box, Button, Typography, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Box textAlign="center" width="100%">
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Etkileşimli Sınıf Platformu
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Giriş yapmak için lütfen rolünüzü seçin
                </Typography>

                <Stack spacing={2} mt={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/login/ogretmen')}
                    >
                        Öğretmen Girişi
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={() => navigate('/login/ogrenci')}
                    >
                        Öğrenci Girişi
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

export default LandingPage;
