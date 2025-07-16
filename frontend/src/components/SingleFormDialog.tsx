import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import React from "react";
import ChalkboardFrame from "./ChalkboardFrame.tsx";

interface SingleFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    label: string;
    value: string |null;
    setValue: (val: string) => void;
    handleUpdate: any;
}

export const SingleFormDialog: React.FC<SingleFormDialogProps> = ({
                                                                      open,
                                                                      setOpen,
                                                                      title,
                                                                      label,
                                                                      value,
                                                                      setValue,
                                                                      handleUpdate
                                                                  }) => {
    const setOpenFalse = () => {
        setOpen(false);
        setValue("");


    }
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>

            <ChalkboardFrame>
                <Box sx={{minHeight:"300px",minWidth:"500px",borderRadius:  "50px"}}>

                <DialogTitle
                sx={{

                    textAlign: "center",
                    fontFamily: "cursive",
                    color: "white"
                }}
            >
                {title}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={label}
                    fullWidth
                    variant="standard"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    InputLabelProps={{ style: { fontFamily: "cursive", color: "white" } }}
                    inputProps={{ style: { fontFamily: "cursive", color: "white" } }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={setOpenFalse}
                    color="error"
                    sx={{ fontFamily: "cursive" }}
                >
                    Vazgeç
                </Button>
                <Button
                    onClick={handleUpdate}
                    color="success"
                    sx={{ fontFamily: "cursive" }}
                >
                    Güncelle
                </Button>
            </DialogActions>
            </Box>
            </ChalkboardFrame>
        </Dialog>
    );
};
