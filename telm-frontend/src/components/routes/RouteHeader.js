import {Box, Button, Typography} from "@mui/material";
import {AddOutlined} from "@mui/icons-material";
import TableCount from "@/components/common/tableCount";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const RouteHeader = ({routes, onClickAdd}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));


    return (
        <>
            <Box
                sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: {
                        xs: '0.5rem 1rem',
                        md: '1rem'
                    },
                    background: {
                        xs: 'linear-gradient(183deg, #dee6ff, #fff 20%)',
                        md: '#fff'
                    }
                }}
            >
                <Box sx={{
                    display: {
                        xs: 'column',
                        md: 'flex'
                    },
                    alignItems: {
                        md: 'center'
                    }, gap: {
                        md: '1.5rem'
                    }
                }}>
                    <Typography
                        sx={{
                            color: 'rgba(0, 0, 0, 0.87)',
                            fontSize: {
                                xs: '1.2rem',
                                md: '1.5rem',
                            },
                            fontWeight: {
                                xs: 600,
                                md: 500
                            },
                            lineHeight: '1.8525rem',
                            letterSpacing: '0.01563rem'
                        }}
                        component="h1">
                        Routes
                    </Typography>
                    <TableCount count={routes.length} vertical={isMobile}/>
                </Box>

                <Box sx={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
                    {/*<TableSearch label={"Search by name"}/>*/}
                    <Button variant="contained" startIcon={<AddOutlined/>} onClick={onClickAdd}>
                        Add New
                    </Button>
                </Box>

            </Box>
        </>
    )
}

export default RouteHeader;