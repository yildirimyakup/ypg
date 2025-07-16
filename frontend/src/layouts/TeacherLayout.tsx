import {
    AppBar,
    Avatar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'; // <- logoyu bu klasöre koy

const drawerWidth = 240;

const menuItems = [
    { label: 'Sınıflarım', path: '/dashboard/ogretmen/classes', icon: <SchoolIcon /> },
    { label: 'Testler', path: '/dashboard/ogretmen/tests', icon: <AssignmentIcon /> },
    { label: 'Raporlar', path: '/dashboard/ogretmen/reports', icon: <BarChartIcon /> },
];

const TeacherLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [time, setTime] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    const { ad, logout } = useAuth();

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // ⏰ Canlı saat
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formatted = now.toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            setTime(formatted);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const drawer = (
        <Box sx={{ height: '100%',marginLeft:"10px", backgroundColor: '#1e3d2f', color: 'white' }}>
            <Box sx={{ display: 'flex', flexDirection:"row",alignItems: 'center' }}>
                <img src={logo} alt="Logo" style={{ width: "30px", height:  '30px',marginRight:"10px",borderRadius:"50px" }} />
                <Typography variant="h6" sx={{ py: 3, textAlign: 'center', fontWeight: 'bold', fontFamily: '"Shadows Into Light", cursive' }}>
                    ÖĞRETMEN PANELİ
                </Typography>
            </Box>

            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        sx={{
                            color: 'white',
                            backgroundColor: location.pathname === item.path ? '#2a5443' : 'transparent',
                            '&:hover': { backgroundColor: '#3b6e57' }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar
                component="nav"
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: 'primary.main',
                    boxShadow: 3
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Hoş geldiniz, {ad}
                    </Typography>

                    <Typography sx={{ mr: 2, fontWeight: 'bold' }}>{time}</Typography>

                    <IconButton onClick={handleAvatarClick}>
                        <Avatar sx={{ bgcolor: '#1E8E3E' }}>{ad?.charAt(0).toUpperCase()}</Avatar>
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={() => { handleMenuClose(); logout(); navigate('/'); }}>
                            Çıkış Yap
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            backgroundColor: '#1e3d2f',
                            color: 'white',
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            backgroundColor: '#1e3d2f',
                            color: 'white',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 8,
                    ml: { sm: `${drawerWidth}px` },
                    height: 'calc(100vh - 64px)',
                    overflowY: 'auto',
                }}
            >
                <Box sx={{ minHeight: '100%', pb: 10 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default TeacherLayout;
