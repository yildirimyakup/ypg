import {Box, Button, TextField} from "@mui/material";
interface Props {
    s: any;
    token: any;
    fetchStudents: any;
    setHata: any;
    ogrAd: string;
    setOgrAd: any;
    ogrEmail: string;
    setOgrEmail: any;
    handleAddStudent: any;
}
export const AddStudentComponent:React.FC<Props> = ({ogrAd,setOgrAd,ogrEmail,setOgrEmail,handleAddStudent,s,token,fetchStudents,setHata}) => {
    return (
    <Box display="flex" alignItems="flex-end" gap={2} mb={2} sx={{marginBottom:"40px",marginTop:"20px"}}>
        <TextField
            label="Öğrenci Adı"
            value={ogrAd}
            onChange={(e) => setOgrAd(e.target.value)}
            variant="standard"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            sx={{
                '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#ffffffaa' },
                '& .MuiInput-underline:after': { borderBottomColor: 'white' },
            }}
        />
        <TextField
            label="Öğrenci Email"
            value={ogrEmail}
            onChange={(e) => setOgrEmail(e.target.value)}
            variant="standard"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            sx={{
                '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: '#ffffffaa' },
                '& .MuiInput-underline:after': { borderBottomColor: 'white' },
            }}
        />
        <Button
            variant="outlined"
            onClick={() => handleAddStudent(s._id,token,fetchStudents,setHata)}
            sx={{ color: 'white', borderColor: 'white' }}
        >
            Ekle
        </Button>
    </Box>

)
}