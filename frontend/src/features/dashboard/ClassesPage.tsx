import {
    Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ListItemText


} from '@mui/material';
import {
    Paper,
    List,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TextField,
    Button,
    Stack,
    Box,
    ButtonGroup,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext.tsx";
import {useDeleteClassHandler} from "./helpers/classes/useDeleteClassHandler.ts";
import {useFetchClassesHandler} from "./helpers/classes/useFetchClassesHandler.ts";
import {useFetchStudentsHandler} from "./helpers/classes/useFetchStudentsHandler.ts";
import {useCreateClassHandler} from "./helpers/classes/useCreateClassHandler.ts";
import {useAddStudentHandler} from "./helpers/classes/useAddStudentHandler.ts";
import {CheckedDialog} from "../../components/CheckedDialog.tsx";
import {useDeleteStudentDialogHandler} from "./helpers/classes/useDeleteStudentDialogHandler.ts";
import {AddStudentComponent} from "./components/classes/AddStudentComponent.tsx";
import {StudentShowComponents} from "./components/classes/StudentShowComponents.tsx";
import {SingleFormDialog} from "../../components/SingleFormDialog.tsx";
import {useUpdateStudentDialogHandler} from "./helpers/classes/useUpdateStudentDialogHandler.ts";
import {useUpdateClassHandler} from "./helpers/classes/useUpdateClassHandler.ts";
import ChalkboardFrame from "../../components/ChalkboardFrame.tsx";


const ClassesPage = () => {
    const [aktifSinifId, setAktifSinifId] = useState<string | null>(null);
    const token = localStorage.getItem('token');
    const { id } = useAuth();
    const {silinicekSinifId,setSilinecekSinifId,setDialogAcik,dialogAcik,handleOpenDeleteDialog} = useDeleteClassHandler();
    const {siniflar,fetchClasses,setSiniflar}=useFetchClassesHandler();
    const {ogrenciler,fetchStudents,setOgrenciler}=useFetchStudentsHandler();
    const {mesaj,handleCreateClass,sinifAd,setSinifAd,setMesaj} =useCreateClassHandler();
    const { ogrAd, setOgrAd, ogrEmail, setOgrEmail, handleAddStudent} = useAddStudentHandler();
    const {ogrenciDialogAcik, setogrenciDialogAcik, silinicekOgrenciId,handleOpenStudentDeleteDialog} =useDeleteStudentDialogHandler();
    const {ogrenciGuncellemeAcik, setogrenciGuncellemeAcik, guncellenecekOgrenciId, handleOpenStudentUpdateDialog,guncellenecekDeger,setguncellenecekDeger} = useUpdateStudentDialogHandler();
    const {guncellenecekAd,setGuncellenecekAd,sinifGuncelleAcik, setSinifGuncelleAcik, guncellenecekSinifId, handleOpenClassUpdateDialog} = useUpdateClassHandler();
    const [hata, setHata] = useState('');
    const [testAtamaDialogAcik, setTestAtamaDialogAcik] = useState(false);
    const [seciliSinifId, setSeciliSinifId] = useState<string | null>(null);
    const [tumTestler, setTumTestler] = useState<any>([]);
    const [testArama, setTestArama] = useState('');

    const fetchAllTests = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/tests/teacher/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTumTestler(res.data);
        } catch {
            setHata('Testler alınamadı');
        }
    };

    const handleTestAtaClick = async (sinifId: string) => {
        setSeciliSinifId(sinifId);
        await fetchAllTests();
        setTestAtamaDialogAcik(true);
    };

    const handleTestiSinifaAta = async (testId: string) => {
        try {
            await axios.put(`http://localhost:3000/api/tests/${testId}/assign-class`, {
                sinifId: seciliSinifId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMesaj("Test sınıfa atandı.");
            await fetchAllTests();
        } catch {
            setHata("Test ataması yapılamadı.");
        }
    };



    const handleDeleteClass = async () => {
        if (!silinicekSinifId) return;

        try {
            await axios.delete(`http://localhost:3000/api/classes/${silinicekSinifId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSiniflar(prev => prev.filter(s => s._id !== silinicekSinifId));
            setOgrenciler([]);
            setMesaj("Sınıf ve sınıfa ait öğrenciler silindi.")
        } catch (err) {
            setHata("Sınıf silinemedi.");
        } finally {
            setDialogAcik(false);
            setSilinecekSinifId(null);
        }
    };
    const handleDeleteStudent = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/classes/student/${silinicekOgrenciId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOgrenciler(prev => prev.filter((o) => o._id !== silinicekOgrenciId));
            setogrenciDialogAcik(false);
            setMesaj("Öğrenci Silindi.")
        }catch (e) {
            setHata("Öğrenci Silinemedi.");
            setogrenciDialogAcik(false);
        }

    };
    const handleUpdateStudent = async () => {

        try {
            await axios.put(`http://localhost:3000/api/classes/student/${guncellenecekOgrenciId}`, { ad: guncellenecekDeger }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if(guncellenecekOgrenciId && guncellenecekDeger){
                setOgrenciler(prev =>
                    prev.map((o) => (o._id === guncellenecekOgrenciId ? { ...o, ad: guncellenecekDeger } : o))
                );
            }
            setMesaj("Öğrenci adı '"+guncellenecekDeger+ "' olarak güncellendi. ")
            setogrenciGuncellemeAcik(false);
        }catch (e) {
            setHata("Öğrenci Güncellenemedi.");
            setogrenciGuncellemeAcik(false);
        }

    };
    const handleUpdateClass = async () => {

        try {
            await axios.put(`http://localhost:3000/api/classes/${guncellenecekSinifId}`, { ad: guncellenecekAd }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if(guncellenecekSinifId && guncellenecekAd){
                setSiniflar(prev =>
                    prev.map((o) => (o._id === guncellenecekSinifId ? { ...o, ad: guncellenecekAd } : o))
                );
            }
            setMesaj("Sınıf adı '"+guncellenecekAd+ "' olarak güncellendi. ")
            setSinifGuncelleAcik(false);
        }catch (e) {
            setHata("Sınıf Güncellenemedi.");
            setSinifGuncelleAcik(false);
        }

    };
    const handleTestiSiniftanKaldir = async (testId: string) => {
        try {
            await axios.put(`http://localhost:3000/api/tests/${testId}/remove-class`, {
                sinifId: seciliSinifId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMesaj("Test ataması kaldırıldı.");
            fetchAllTests();
        } catch {
            setHata("Test kaldırma başarısız oldu.");
        }
    };

    useEffect(() => {
        fetchClasses(id,token,setHata);
    }, []);

    return (
        <Box >
            {mesaj && <Alert severity="success">{mesaj}</Alert>}
            {hata && <Alert severity="error">{hata}</Alert>}

            <Box sx={{border:"0.5px solid green" , padding:"10px",marginTop:"15px",marginBottom:"10px",borderRadius:"5px",background:"white"}}>
                <Typography variant="h3" sx={{fontFamily:"cursive",color:"#1e3d2f"}}  gutterBottom>SINIFLARIM</Typography>
                <Stack direction="column" spacing={2} alignItems="center" mb={3}>
                    <TextField label="Sınıf Adı" sx={{width:"100%"}} value={sinifAd} onChange={(e) => setSinifAd(e.target.value)} />
                    <Button variant="contained" sx={{height:"100%",width:"100%"}} onClick={()=>handleCreateClass(id,token,fetchClasses,setHata)}>Yeni Sınıf Oluştur</Button>
                </Stack>
            </Box>


            <Paper elevation={2} sx={{ p: 2 }}>

                <List>
                    {siniflar.map((s) => (
                        <Accordion key={s._id} expanded={aktifSinifId === s._id} onChange={() => {
                            const yeniId = s._id === aktifSinifId ? null : s._id;
                            setAktifSinifId(yeniId);
                            if (yeniId) fetchStudents(s._id,token,setHata);
                        }} sx={{ mb: 2, border: "2px solid #8B5E3C", borderRadius: "5px", bgcolor: '#2a5443', color: 'white' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                                <Typography sx={{ flexGrow: 1 }}>{s.ad}</Typography>
                                <ButtonGroup variant="text" size="small">
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTestAtaClick(s._id);
                                        }}
                                        sx={{ color: 'gold' }}
                                    >
                                        Test Ata
                                    </Button>
                                    <Button onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenClassUpdateDialog(s._id,siniflar.find((b:any) => b._id ===  s._id)?.ad || '')
                                    }} sx={{ color: 'hotpink' }}>
                                        Sınıfı Düzenle
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDeleteDialog(s._id);
                                        }}
                                        sx={{ color: 'red' }}
                                    >
                                        Sınıfı Sil
                                    </Button>
                                    <Button onClick={(e) => {
                                        e.stopPropagation();
                                        setAktifSinifId(s._id === aktifSinifId ? null : s._id);
                                        fetchStudents(s._id,token,setHata);
                                    }} sx={{ color: 'white' }}>
                                        Öğrencileri Göster
                                    </Button>
                                </ButtonGroup>
                            </AccordionSummary>
                            <AccordionDetails sx={{borderTop:"3px solid white" , padding:"10px",margin:"5px"}}>
                                <Box >
                                    <AddStudentComponent
                                        s={s}
                                        token={token}
                                        fetchStudents={fetchStudents}
                                        setHata={setHata}
                                        ogrAd={ogrAd}
                                        setOgrAd={setOgrAd}
                                        ogrEmail={ogrEmail}
                                        setOgrEmail={setOgrEmail}
                                        handleAddStudent={handleAddStudent} />
                                    <Typography sx={{marginBottom:"5px",fontFamily:"cursive",fontWeight:"bold"}}>ÖĞRENCİ LİSTESİ</Typography>
                                    {/* Öğrenci listesi */}
                                    {ogrenciler.map((o) => (
                                        <StudentShowComponents
                                            key={o._id}
                                            handleOpenStudentUpdateDialog={handleOpenStudentUpdateDialog}
                                            handleOpenStudentDeleteDialog={handleOpenStudentDeleteDialog}
                                            ogrenciler={ogrenciler}
                                            o={o}
                                        />
                                    ))}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </List>
            </Paper>
            <CheckedDialog acikKapali={dialogAcik} setDialogAcik={setDialogAcik} handleAction={handleDeleteClass} title={"SINIF SİL"} message={" Bu sınıf ve tüm öğrencileri kalıcı olarak silinecek. Emin misiniz?"} />
            <CheckedDialog acikKapali={ogrenciDialogAcik} setDialogAcik={setogrenciDialogAcik} handleAction={handleDeleteStudent} title={"ÖĞRENCİ SİL"} message={" Öğrenci silinecek. Emin misiniz?"} />
            <SingleFormDialog
                title={"ÖĞRENCİ GÜNCELLE"}
                open={ogrenciGuncellemeAcik}
                value={guncellenecekDeger}
                setOpen={setogrenciGuncellemeAcik}
                label={"İsim"}
                setValue={setguncellenecekDeger}
                handleUpdate={handleUpdateStudent}  />

            <SingleFormDialog
                title={"SINIF GÜNCELLE"}
                open={sinifGuncelleAcik}
                value={guncellenecekAd}
                setOpen={setSinifGuncelleAcik}
                label={"Sınıf Adı"}
                setValue={setGuncellenecekAd}
                handleUpdate={handleUpdateClass}  />
            <Dialog open={testAtamaDialogAcik} sx={{borderRadius:  "50px"}} onClose={() => setTestAtamaDialogAcik(false)} fullWidth maxWidth="sm">

            <ChalkboardFrame>
                <Box sx={{minHeight:"300px",minWidth:"500px",borderRadius:  "50px"}}>

                <DialogTitle sx={{fontFamily:"cursive",textAlign:"center"}}>TEST ATA / KALDIR</DialogTitle>
                <DialogContent  >
                    <TextField
                        autoFocus
                        margin="dense"
                        variant="standard"
                        InputLabelProps={{ style: { fontFamily: "cursive", color: "white" } }}
                        inputProps={{ style: { fontFamily: "cursive", color: "white" } }}
                        fullWidth
                        label="Test Ara"
                        value={testArama}
                        onChange={(e) => setTestArama(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <List>
                        {tumTestler
                            .filter((t:any) => t.baslik.toLowerCase().includes(testArama.toLowerCase()))
                            .map((t:any) => {
                                const zatenAtanmis = t.atananSiniflar?.includes(seciliSinifId!);
                                return (
                                    <ListItem key={t._id}>
                                        <ListItemText primary={t.baslik} />
                                        {zatenAtanmis ? (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleTestiSiniftanKaldir(t._id)}
                                            >
                                                Kaldır
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={() => handleTestiSinifaAta(t._id)}
                                            >
                                                Ata
                                            </Button>
                                        )}
                                    </ListItem>
                                );
                            })}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button color={"error"} onClick={() => setTestAtamaDialogAcik(false)}>Kapat</Button>
                </DialogActions>
                </Box>
            </ChalkboardFrame>

        </Dialog>


        </Box>
    );
};

export default ClassesPage;
