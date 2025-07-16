import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";

interface Props {
    modalAcik: boolean;
    setModalAcik: (val: boolean) => void;
    seciliOgrenciAd: string;
    testSonuclari: any[];
    cozulmemisTestler: any[];
}

export const StudentShowDialog: React.FC<Props> = ({
                                                       modalAcik,
                                                       setModalAcik,
                                                       seciliOgrenciAd,
                                                       testSonuclari,
                                                       cozulmemisTestler
                                                   }) => {
    return (
        <Dialog open={modalAcik} onClose={() => setModalAcik(false)} maxWidth="md" fullWidth>
            <DialogTitle>{seciliOgrenciAd} – Test Sonuçları</DialogTitle>
            <DialogContent>
                {testSonuclari.length === 0 ? (
                    <Typography color="text.secondary">Test sonucu bulunamadı.</Typography>
                ) : (
                    <Stack spacing={2}>
                        {testSonuclari.map((s, i) => (
                            <Accordion key={i} sx={{ bgcolor: '#f9f9f9', borderRadius: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box>
                                        <Typography fontWeight="bold">{s.testId?.baslik}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(s.tarih).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2">Puan: {s.puan}</Typography>
                                        <Typography variant="body2">Geri Bildirim: {s.geribildirim}</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Divider sx={{ mb: 2 }} />
                                    <Stack spacing={2}>
                                        {s.testSorulari?.map((soru: any, index: number) => {
                                            const ogrCevap = s.cevaplar[index];
                                            const dogruMu = ogrCevap === soru.cevap;

                                            return (
                                                <Paper
                                                    key={index}
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: dogruMu ? '#e8f5e9' : '#ffebee',
                                                        borderLeft: `4px solid ${dogruMu ? '#66bb6a' : '#ef5350'}`
                                                    }}
                                                >
                                                    <Typography>
                                                        <strong>Soru {index + 1}:</strong> {soru.icerik}
                                                    </Typography>
                                                    <Typography>
                                                        <strong>Verilen Cevap:</strong> {ogrCevap} {dogruMu ? '✅' : '❌'}
                                                    </Typography>
                                                    {!dogruMu && (
                                                        <Typography>
                                                            <strong>Doğru Cevap:</strong> {soru.cevap}
                                                        </Typography>
                                                    )}
                                                </Paper>
                                            );
                                        })}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Stack>
                )}

                <Box mt={4}>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="h6">Çözülmemiş Testler</Typography>
                    {cozulmemisTestler.length === 0 ? (
                        <Typography color="text.secondary">Yok</Typography>
                    ) : (
                        <Stack spacing={0.5} mt={1}>
                            {cozulmemisTestler.map((t, i) => (
                                <Typography key={i} sx={{ ml: 1, color: 'text.secondary' }}>
                                    • {t.baslik}
                                </Typography>
                            ))}
                        </Stack>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};
