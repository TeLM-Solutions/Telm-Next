import {Roboto} from 'next/font/google';
import {createTheme} from '@mui/material/styles';
import {red} from '@mui/material/colors';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

// Create a theme instance.
const theme = createTheme({
    palette: {
        background: {
            default: '#E6F9FF',
        },
        primary: {
            main: '#4844FF',
        },
        secondary: {
            main: '#2196F3',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        button: {
            lineHeight: '1.714285'
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: '#FFFFFF',
                    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.20)',
                    color: 'rgba(0, 0, 0, 0.87)'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#959595',
                        }
                    }
                }
            }
        }
    },
});

export default theme;