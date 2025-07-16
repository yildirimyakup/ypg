// QuestionCardComponent.tsx

import React from "react";
import {
    Paper,
    Typography,
    IconButton,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface Props {
    soru: any;
    index: number;
    handleQuestionDelete: (id: string) => void;
}

export const QuestionCardComponent: React.FC<Props> = ({ soru, index, handleQuestionDelete }) => {
    return (
        <Paper
            key={soru._id || index}
            sx={{
                p: 3,
                mb: 3,
                border: '2px solid #8B5E3C',
                borderRadius: 2,
                backgroundColor: '#2a5443',
                color: 'white',
                fontFamily: 'cursive',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
        >

            <Typography variant="h6" sx={{ mb: 1 }}>
                <strong>Soru {index + 1}:</strong> {soru.icerik}
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Cevap: <strong>{soru.cevap}</strong>
            </Typography>

            {soru.secenekler && (
                <List dense>
                    {soru.secenekler.map((sec: string, j: number) => (
                        <ListItem key={j} disablePadding>
                            <ListItemIcon>
                                {sec === soru.cevap ? <CheckCircleOutlineIcon sx={{ color: 'lightgreen' }} /> : <RadioButtonUncheckedIcon sx={{ color: 'gray' }} />}
                            </ListItemIcon>
                            <ListItemText primary={sec} primaryTypographyProps={{ sx: { color: 'white' } }} />
                        </ListItem>
                    ))}
                </List>
            )}

            <Box sx={{display:"flex",flex:1,justifyContent:"flex-end",alignItems:"center"}}>
                <Box sx={{ backgroundColor:"hotpink",borderRadius:"50px",}}>
                    <IconButton  onClick={() => handleQuestionDelete(soru._id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>

            </Box>
        </Paper>
    );
};
