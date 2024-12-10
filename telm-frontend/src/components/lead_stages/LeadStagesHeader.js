import {Box, Button, Typography} from "@mui/material";
import {AddOutlined} from "@mui/icons-material";
import TableCount from "@/components/common/tableCount";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const LeadStagesHeader = ({lead_stages, onClickAdd}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Box
            sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: {
                    xs: '0.5rem 1rem',
                    md: '1rem'
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
                    Lead Stages
                </Typography>
                <TableCount count={lead_stages.length} vertical={isMobile}/>
            </Box>

            <Box sx={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
                <Button variant="contained" startIcon={<AddOutlined/>} onClick={onClickAdd}>
                    Add New
                </Button>
            </Box>
        </Box>
    )
}

export default LeadStagesHeader;