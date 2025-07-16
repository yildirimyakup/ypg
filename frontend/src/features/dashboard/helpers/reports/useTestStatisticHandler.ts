import axios from "axios";
import {useState} from "react";

export const useTestStatisticHandler = () => {
    const [testIstatistik, setTestIstatistik] = useState<any | null>(null);
    const [modalTestAcik, setModalTestAcik] = useState(false);

    const fetchTestStatistics = async (testId: string,token:any) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/reports/test-stats/${testId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTestIstatistik(res.data);
            setModalTestAcik(true);
        } catch (err) {
            console.error("İstatistik verisi alınamadı");
        }
    };

    return {testIstatistik, fetchTestStatistics,modalTestAcik,setModalTestAcik,setTestIstatistik};
};