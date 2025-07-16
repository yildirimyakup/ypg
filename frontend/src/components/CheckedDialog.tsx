import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
interface Props {
    acikKapali:boolean;
    setDialogAcik:any;
    handleAction:any;
    message:string;
    title:string;
}
export const CheckedDialog:React.FC<Props> = ({acikKapali,setDialogAcik,handleAction,message,title}) => {
    return (
        <Dialog open={acikKapali} onClose={() => setDialogAcik(false)}>
        <DialogTitle sx={{textAlign:"center",fontFamily:"cursive",color:"red"}}>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{fontFamily:"cursive"}}>
                {message}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDialogAcik(false)} color="primary" sx={{fontFamily:"cursive"}}>
                Vazgeç
            </Button>
            <Button onClick={handleAction} color="error" sx={{fontFamily:"cursive"}}>
                Sil
            </Button>
        </DialogActions>
    </Dialog>)
}