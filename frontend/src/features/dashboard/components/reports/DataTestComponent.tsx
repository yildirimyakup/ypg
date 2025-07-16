import TextField from "@mui/material/TextField";
import {DataGrid} from "@mui/x-data-grid";
interface Props {
    testArama:string;
    setTestArama:any;
    filtreliTestler:any;
    testColumns:any;
    fetchTestStatistics:any;
    setTestStatistics:any;
}
export const DataTestComponent:React.FC<Props>= ({setTestArama,testArama,filtreliTestler,testColumns,fetchTestStatistics,}) => {
    return(
        <>
            <TextField
                label="Test Ara"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={testArama}
                onChange={(e) => setTestArama(e.target.value)}
            />

            <DataGrid
                rows={filtreliTestler.map(t => ({
                    ...t,
                    soruSayisi: t.soruListesi.length
                }))}
                columns={testColumns}
                onRowClick={(params) => fetchTestStatistics(params.row._id)}
                autoHeight
                getRowId={(row) => row._id}
            />
        </>
    )
}