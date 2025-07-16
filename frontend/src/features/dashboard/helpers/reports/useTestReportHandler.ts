import axios from "axios";
import {useState} from "react";

export const useTestReportHandler = () => {
    const [seciliOgrenciAd, setSeciliOgrenciAd] = useState('');
    const [testSonuclari, setTestSonuclari] = useState<any[]>([]);
    const [cozulmemisTestler, setCozulmemisTestler] = useState<any[]>([]);




    const fetchTestResults = async (ogrenciId: string, ogrenciAd: string,token:any,setModalAcik:any) => {
        try {
            const [cozulen, cozulmayan] = await Promise.all([
                axios.get(`http://localhost:3000/api/results/student/${ogrenciId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`http://localhost:3000/api/reports/missing-tests/${ogrenciId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setSeciliOgrenciAd(ogrenciAd);
            setTestSonuclari(cozulen.data);
            setCozulmemisTestler(cozulmayan.data);
            setModalAcik(true);
        } catch {
            console.error('Veriler alınamadı.');
        }
    };
    return {fetchTestResults,setTestSonuclari,setCozulmemisTestler,seciliOgrenciAd,setSeciliOgrenciAd,cozulmemisTestler,testSonuclari}
};