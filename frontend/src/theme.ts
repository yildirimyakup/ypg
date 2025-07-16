import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1E8E3E',
        },
        secondary: {
            main: '#4285F4',
        },
        background: {
            default: 'rgba(207,206,206,0.78)',
        },
    },
    typography: {
        fontFamily: 'Roboto, "Shadows Into Light", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    height: '100%',
                },
                body: {
                    height: '100%',
                    margin: 0,
                    padding: 0,
                    backgroundColor: 'rgba(207,206,206,0.78)',
                    overflowY: 'auto',
                },
                '#root': {
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                },
            },
        },
    }

});

export default theme;
