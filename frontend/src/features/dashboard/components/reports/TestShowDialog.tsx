import {
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";

interface Props {
    modalTestAcik: boolean;
    setModalTestAcik: (val: boolean) => void;
    testIstatistik: any | null;
}

export const TestShowDialog: React.FC<Props> = ({
                                                    modalTestAcik,
                                                    setModalTestAcik,
                                                    testIstatistik
                                                }) => {
    return (
        <Dialog open={modalTestAcik} onClose={() => setModalTestAcik(false)} maxWidth="md" fullWidth>
            <DialogTitle>{testIstatistik?.testBaslik} – Detaylı Analiz</DialogTitle>
            <DialogContent>
                {testIstatistik ? (
                    <>
                        <Typography variant="body1" fontWeight="medium">
                            Toplam Çözen: <strong>{testIstatistik.toplamCozen}</strong>
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" gutterBottom>
                            Toplam Soru: <strong>{testIstatistik.toplamSoru}</strong>
                        </Typography>

                        <Stack spacing={2} mt={2}>
                            {testIstatistik.istatistikler.map((soru: any, index: number) => (
                                <Paper
                                    key={index}
                                    sx={{
                                        p: 2,
                                        backgroundColor: '#f5f5f5',
                                        borderLeft: '4px solid #42a5f5'
                                    }}
                                >
                                    <Typography variant="subtitle1">
                                        <strong>Soru {soru.soruNo}:</strong> {soru.icerik}
                                    </Typography>

                                    <Typography sx={{ mt: 1 }}>
                                        ✅ <strong>Doğru Cevaplama:</strong>{' '}
                                        <span style={{ color: soru.dogruYuzde >= 50 ? '#388e3c' : '#d32f2f' }}>
                                            {soru.dogruYuzde}%
                                        </span>
                                    </Typography>

                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                                        Seçenek Dağılımı:
                                    </Typography>

                                    <Stack spacing={0.5} sx={{ pl: 2 }}>
                                        {Object.entries(soru.secenekSayac).map(
                                            ([secenek, sayi]: any, i) => (
                                                <Typography key={i} variant="body2">
                                                    • {secenek}: {sayi} kişi
                                                </Typography>
                                            )
                                        )}
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    </>
                ) : (
                    <Typography>Veri bulunamadı.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};
