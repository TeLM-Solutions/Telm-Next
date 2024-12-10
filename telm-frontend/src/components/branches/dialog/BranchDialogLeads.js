import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Box, Chip, Divider, Stack, Table, TableContainer, Tooltip, Typography} from "@mui/material";
import {StyledPaper} from "@/styles/styles";
import TableCount from "@/components/common/tableCount";
import TableEmpty from "@/components/common/TableEmpty";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import LeadTableServices from "@/components/leads/LeadTableServices";
import LeadUrgency from "@/components/leads/shared/LeadUrgency";
import LeadStatusSlide from "@/components/leads/shared/LeadStatusSlide";
import {dateFormat, relativeTimeUtil} from "@/lib/relativeTime";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const BranchDialogLeads = ({leads}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Box sx={StyledPaper}>
            <Box className={"heading has-button"}>
                <Stack direction={"row"} gap={"1rem"}>
                    <Typography>Leads</Typography>
                    <TableCount vertical={true} count={leads.length}/>
                </Stack>
            </Box>
            <Divider/>
            <TableContainer>
                <Table size={"small"} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Business</TableCell>
                            {!isMobile &&
                                <>
                                    <TableCell>Services</TableCell>
                                    <TableCell>Urgency</TableCell>
                                    <TableCell>Lead Classification</TableCell>
                                    <TableCell align={"right"}>Created</TableCell>
                                    <TableCell></TableCell>
                                </>
                            }
                        </TableRow>
                        {leads.length > 0 &&
                            <>
                                {leads.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Stack gap={"1rem"} sx={{

                                                padding: {
                                                    xs: '0 0 1rem',
                                                    md: 0
                                                }
                                            }}>

                                                <BusinessNameBlock name={row.business.name}

                                                                   location={row.business.location.name}/>
                                                {isMobile &&
                                                    <LeadTableServices isRow={true} services={row.services}/>
                                                }
                                            </Stack>

                                        </TableCell>
                                        {!isMobile &&
                                            <>
                                                <TableCell>
                                                    <LeadTableServices services={row.services}/>
                                                </TableCell>
                                                <TableCell>
                                                    <LeadUrgency urgency={row.urgency}/>
                                                </TableCell>
                                                <TableCell>
                                                    <LeadStatusSlide lead_status={row.lead_status}/>
                                                </TableCell>
                                                <TableCell align={"right"}>
                                                    <Tooltip title={dateFormat(row.created_at)} arrow placement="top">
                                                        <Chip
                                                            variant={row.created_at ? "outlined" : 'filled'}
                                                            label={row.created_at ? relativeTimeUtil(row.created_at) : ''}/>
                                                    </Tooltip>

                                                </TableCell>
                                            </>
                                        }
                                    </TableRow>
                                ))}
                            </>
                        }
                    </TableHead>

                    {leads.length === 0 &&
                        <TableRow>
                            <TableCell component="th" scope="row" colSpan={"5"} align={"center"}>
                                <TableEmpty message={"No leads to display"}/>
                            </TableCell>
                        </TableRow>
                    }
                </Table>
            </TableContainer>
        </Box>
    )
}
export default BranchDialogLeads;