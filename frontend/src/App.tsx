import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './features/landing/LandingPage';
import TeacherLogin from './features/auth/TeacherLogin';
import TeacherRegister from './features/auth/TeacherRegister';
import StudentLogin from './features/auth/StudentLogin';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import TeacherLayout from "./layouts/TeacherLayout.tsx";
import TeacherDashboard from "./features/dashboard/TeacherDashboard.tsx";
import TestsPage from "./features/dashboard/TestsPage.tsx";
import ReportsPage from "./features/dashboard/ReportsPage.tsx";
import ClassesPage from "./features/dashboard/ClassesPage.tsx";
import StudentLayout from './layouts/StudentLayout.tsx';
import StudentDashboard from "./features/student/StudentDashboard.tsx";
import AssignedTests from './features/student/AssignedTests.tsx';
import SolveTestPage from "./features/student/SolveTestPage.tsx";
import MyResultsPage from "./features/student/MyResultsPage.tsx";
import ChalkboardFrame from "./components/ChalkboardFrame.tsx";
import {Box} from "@mui/material";


const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes >
                    <Route path="/" element={<Box
                        sx={{
                            height: '100vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f2f2f2', // tema rengiyle uyumlu
                        }}
                    >
                        <ChalkboardFrame>
                            <LandingPage />
                        </ChalkboardFrame>
                    </Box>} />
                    <Route path="/login/ogretmen" element={<Box
                        sx={{
                            height: '100vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f2f2f2', // tema rengiyle uyumlu
                        }}
                    >
                        <ChalkboardFrame>
                            <TeacherLogin />
                        </ChalkboardFrame>
                    </Box>} />
                    <Route path="/login/ogrenci" element={<Box
                        sx={{
                            height: '100vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f2f2f2', // tema rengiyle uyumlu
                        }}
                    >
                        <ChalkboardFrame>
                            <StudentLogin />
                        </ChalkboardFrame>
                    </Box>} />
                    <Route path="/register/ogretmen" element={<Box
                        sx={{
                            height: '100vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f2f2f2', // tema rengiyle uyumlu
                        }}
                    >
                        <ChalkboardFrame>
                            <TeacherRegister />
                        </ChalkboardFrame>
                    </Box>} />

                    <Route
                        path="/dashboard/ogretmen"
                        element={
                            <PrivateRoute requiredRole="ogretmen">
                                <TeacherLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<TeacherDashboard />} />
                        <Route path="classes" element={<ClassesPage />} />
                        <Route path="tests" element={<TestsPage />} />
                        <Route path="reports" element={<ReportsPage />} />
                    </Route>
                    <Route path="/dashboard/ogrenci" element={
                        <PrivateRoute requiredRole="ogrenci">
                            <StudentLayout />
                        </PrivateRoute>
                    }>
                        <Route index element={<StudentDashboard />} />
                        <Route path="assigned" element={<AssignedTests />} />
                        <Route path="solve/:testId" element={<SolveTestPage />} />
                        <Route path="results" element={<MyResultsPage />} />
                    </Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
