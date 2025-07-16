import {
    AppBar,
    Box,
    CssBaseline,
    Toolbar,
    Typography,
    Button,
    Stack,
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // saat ikonu
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const StudentLayout = () => {
    const navigate = useNavigate();
    const { ad, logout } = useAuth();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [zaman, setZaman] = useState<string>(new Date().toLocaleTimeString('tr-TR'));

    useEffect(() => {
        const timer = setInterval(() => {
            setZaman(new Date().toLocaleTimeString('tr-TR'));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />

            <AppBar position="fixed" sx={{ bgcolor: '#1e3d2f' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <MenuBookIcon />
                        <Typography variant="h6" sx={{ fontFamily: 'cursive' }}>
                            Hoş geldin, {ad}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon fontSize="small" sx={{ color: '#ffffffaa' }} />
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#ffffffcc' }}>
                                {zaman}
                            </Typography>
                        </Stack>

                        <Button color="inherit" onClick={() => navigate('/dashboard/ogrenci/assigned')}>
                            Testlerim
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/dashboard/ogrenci/results')}>
                            Sonuçlarım
                        </Button>

                        <Avatar
                            onClick={handleMenuOpen}
                            sx={{ bgcolor: '#f5b041', cursor: 'pointer' }}
                        >
                            {ad?.[0]?.toUpperCase() || '?'}
                        </Avatar>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>Profil</MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleMenuClose();
                                    logout();
                                    navigate('/');
                                }}
                            >
                                Çıkış Yap
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default StudentLayout;
