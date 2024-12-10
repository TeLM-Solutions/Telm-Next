import Appbar from "./appbar";
import {Box} from "@mui/material";
import Sidebar from "./Sidebar/Sidebar";
import {useAuth} from '@/hooks/auth'
import Image from "next/image";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const DefaultLayout = ({children, padded = true}) => {

    const {user} = useAuth({middleware: 'auth'})
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <>
            {user &&
                <>
                    <Appbar user={user} isMobile={isMobile}/>
                    <Box sx={{
                        display: 'flex', paddingTop: {
                            xs: "3.5rem",
                            md: 0
                        }
                    }}>
                        {!isMobile &&
                            <Sidebar user={user}/>
                        }
                        <Box sx={{padding: padded ? isMobile ? '1rem' : '1.5rem' : 0, flex: '1'}}>{children}</Box>
                    </Box>
                </>
            }
            {!user &&
                <Box sx={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Image src={"/images/login-logo.png"} alt={"logo"} width={270} height={80}/>
                </Box>
            }
        </>
    );
};

export default DefaultLayout;