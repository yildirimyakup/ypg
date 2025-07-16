import {
    Box, Typography

} from '@mui/material';
import { useEffect, useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import {TestShowDialog} from "./components/reports/TestShowDialog.tsx";
import {StudentShowDialog} from "./components/reports/StudentShowDialog.tsx";
import {DataStudentComponent} from "./components/reports/DataStudentComponent.tsx";
import {DataTestComponent} from "./components/reports/DataTestComponent.tsx";
import {SelectTypeComponent} from "./components/reports/SelectTypeComponent.tsx";
import {useStudentReportHandler} from "./helpers/reports/useStudentReportHandler.ts";
import {useAllTestReportHandler} from "./helpers/reports/useAllTestReportHandler.ts";
import {useTestStatisticHandler} from "./helpers/reports/useTestStatisticHandler.ts";
import {useTestReportHandler} from "./helpers/reports/useTestReportHandler.ts";

const ReportsPage = () => {
    const{raporlar,fetchAllStudentReports}= useStudentReportHandler();
    const{testler,fetchAllTests}= useAllTestReportHandler();
    const {modalTestAcik,setModalTestAcik,testIstatistik,setTestIstatistik,fetchTestStatistics}=useTestStatisticHandler();
    const {cozulmemisTestler,testSonuclari,seciliOgrenciAd,fetchTestResults}=useTestReportHandler();

    const token = localStorage.getItem('token');
    const ogretmenId = localStorage.getItem('id');
    const [testArama, setTestArama] = useState('');
    const [secim, setSecim] = useState<'ogrenci' | 'test'>('ogrenci');
    const [modalAcik, setModalAcik] = useState(false);
    const [ogrenciArama, setOgrenciArama] = useState('');

    const filteredRows = raporlar.filter((ogr) =>
        ogr.ogrenciAd.toLowerCase().includes(ogrenciArama.toLowerCase())
    );
    const filtreliTestler = testler.filter((t) =>
        t.baslik.toLowerCase().includes(testArama.toLowerCase())
    );


    const ogrenciColumns: GridColDef[] = [
        {
            field: 'ogrenciAd',
            headerName: 'Öğrenci Adı',
            flex: 1,
            filterable: true,
            renderCell: (params) => (
                <Typography
                    onClick={() => fetchTestResults(params.row.ogrenciId, params.row.ogrenciAd,token,setModalAcik)}
                    sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
                >
                    {params.row.ogrenciAd}
                </Typography>
            )
        },
        {
            field: 'sinifAd',
            headerName: 'Sınıf',
            width: 150,
            filterable: true
        },
        {
            field: 'testSayisi',
            headerName: 'Test Sayısı',
            width: 130,
            filterable: true
        },
        {
            field: 'ortalama',
            headerName: 'Ortalama',
            width: 130,
            filterable: true
        }
    ];


    const testColumns: GridColDef[] = [
        { field: 'baslik', headerName: 'Test Adı', flex: 1 },
        { field: 'soruSayisi', headerName: 'Soru Sayısı', width: 150 },
        {
            field: 'siniflar',
            headerName: 'Atandığı Sınıflar',
            flex: 1,
            renderCell: (params: any) => {
                const siniflar = params.row?.atananSiniflar;
                if (!Array.isArray(siniflar) || siniflar.length === 0) return '—';
                return siniflar.map((s: any, index: number) => (
                    <span key={index}>{s.ad}{index < siniflar.length - 1 ? ', ' : ''}</span>
                ));
            }
        }
    ];







    useEffect(() => {
        fetchAllStudentReports(token,ogretmenId);
        fetchAllTests(token,ogretmenId);
    }, []);



    return (
        <Box>
            <Typography variant="h5" sx={{fontFamily:"cursive",mb:3 ,color: "#1e3d2f"}} gutterBottom>Raporlama ve Takip</Typography>

            <SelectTypeComponent secim={secim} setSecim={setSecim} />

            {secim === 'ogrenci' && (
                <DataStudentComponent setModalAcik={setModalAcik}  modalAcik={modalAcik} ogrenciColumns={ogrenciColumns} setOgrenciArama={setOgrenciArama} ogrenciArama={ogrenciArama} filteredRows={filteredRows}  />
            )}
            {secim === 'test' && (
                <DataTestComponent testArama={testArama} setTestArama={setTestArama} filtreliTestler={filtreliTestler} testColumns={testColumns} fetchTestStatistics={fetchTestStatistics} setTestStatistics={setTestIstatistik} />
            )}
            <TestShowDialog modalTestAcik={modalTestAcik} setModalTestAcik={setModalTestAcik} testIstatistik={testIstatistik} />
            <StudentShowDialog cozulmemisTestler={cozulmemisTestler} testSonuclari={testSonuclari} seciliOgrenciAd={seciliOgrenciAd} setModalAcik={setModalAcik} modalAcik={modalAcik} />


        </Box>
    );
};

export default ReportsPage;
