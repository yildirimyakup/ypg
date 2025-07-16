import axios from "axios";
import {useState} from "react";

export const useAllTestReportHandler = () => {
    const [testler, setTestler] = useState<any[]>([]);

    const fetchAllTests = async (token:any,ogretmenId:any) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/tests/teach/${ogretmenId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTestler(res.data);
        } catch (err) {
            console.error("Testler alınamadı");
        }
    };
    return {testler, fetchAllTests};

};