import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { ad } = useAuth();
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Hoş geldin {ad} 👋
            </Typography>
            <Typography variant="body1" gutterBottom>
                Buradan atanmış testlerini çözebilir, geçmiş sonuçlarını inceleyebilirsin.
            </Typography>

            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/dashboard/ogrenci/assigned')}>
                Testlerime Git
            </Button>
        </Box>
    );
};

export default StudentDashboard;
