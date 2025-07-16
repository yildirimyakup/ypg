import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    Divider
} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                padding: 4,
                backgroundColor: "#f0f4f3",
                minHeight: "100vh"
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    fontFamily: "cursive",
                    color: "#1e3d2f",
                    mb: 3,
                    fontWeight: "bold"
                }}
            >
                Öğretmen Paneli
            </Typography>

            <Typography variant="subtitle1" sx={{ mb: 4, color: "#3d3d3d" }}>
                Sınıflarınızı yönetin, testler oluşturun ve öğrencilerin ilerlemesini takip edin.
            </Typography>

            <Stack spacing={3} direction={{ xs: "column", md: "row" }}>
                <Paper
                    elevation={4}
                    sx={{
                        flex: 1,
                        padding: 3,
                        backgroundColor: "#ffffff",
                        borderLeft: "6px solid #2a5443"
                    }}
                >
                    <Stack spacing={2}>
                        <SchoolIcon fontSize="large" sx={{ color: "#2a5443" }} />
                        <Typography variant="h6" sx={{ fontFamily: "cursive" }}>
                            Sınıfları Yönet
                        </Typography>
                        <Typography variant="body2">
                            Yeni sınıflar oluşturun, öğrencileri yönetin ve her sınıf için ayrı içerikler hazırlayın.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("/dashboard/ogretmen/classes")}>
                            Sınıflara Git
                        </Button>
                    </Stack>
                </Paper>

                <Paper
                    elevation={4}
                    sx={{
                        flex: 1,
                        padding: 3,
                        backgroundColor: "#ffffff",
                        borderLeft: "6px solid #8B5E3C"
                    }}
                >
                    <Stack spacing={2}>
                        <AssignmentIcon fontSize="large" sx={{ color: "#8B5E3C" }} />
                        <Typography variant="h6" sx={{ fontFamily: "cursive" }}>
                            Testleri Yönet
                        </Typography>
                        <Typography variant="body2">
                            Test oluşturun, mevcut testleri düzenleyin veya öğrencilere test atayın.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("/dashboard/ogretmen/tests")}>
                            Testlere Git
                        </Button>
                    </Stack>
                </Paper>

                <Paper
                    elevation={4}
                    sx={{
                        flex: 1,
                        padding: 3,
                        backgroundColor: "#ffffff",
                        borderLeft: "6px solid #c57f00"
                    }}
                >
                    <Stack spacing={2}>
                        <GroupsIcon fontSize="large" sx={{ color: "#c57f00" }} />
                        <Typography variant="h6" sx={{ fontFamily: "cursive" }}>
                            Raporlar & Performans
                        </Typography>
                        <Typography variant="body2">
                            Öğrenci performanslarını görüntüleyin, test başarılarını analiz edin.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate("/dashboard/ogretmen/reports")}>
                            Raporlara Git
                        </Button>
                    </Stack>
                </Paper>
            </Stack>

            <Divider sx={{ my: 4 }} />

            <Typography variant="body2" sx={{ color: "gray" }}>
                👨‍🏫 Eğitimde fark yaratmak sizin elinizde.
            </Typography>
        </Box>
    );
}
