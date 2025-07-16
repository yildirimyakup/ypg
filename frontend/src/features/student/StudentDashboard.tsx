import { Box, Typography, Button, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';

const StudentDashboard = () => {
    const { ad } = useAuth();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                backgroundColor: '#f0f4f7',
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 5,
                    borderRadius: 3,
                    maxWidth: 500,
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                }}
            >
                <SchoolIcon sx={{ fontSize: 60, color: '#1e3d2f', mb: 2 }} />

                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontFamily: 'cursive', color: '#1e3d2f' }}
                >
                    Hoş geldin, {ad} 👋
                </Typography>

                <Typography variant="body1" sx={{ mt: 2, fontSize: '1rem' }}>
                    Bu panel üzerinden atanmış testlerini çözebilir,<br />
                    geçmiş sonuçlarını detaylı olarak inceleyebilirsin.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 4,
                        px: 5,
                        py: 1.5,
                        bgcolor: '#1e3d2f',
                        '&:hover': { bgcolor: '#295c45' },
                        fontWeight: 'bold',
                        fontFamily: 'cursive'
                    }}
                    onClick={() => navigate('/dashboard/ogrenci/assigned')}
                >
                    Testlerime Git
                </Button>
            </Paper>
        </Box>
    );
};

export default StudentDashboard;
