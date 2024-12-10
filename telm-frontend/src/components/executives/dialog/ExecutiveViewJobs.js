import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Box, Divider, Stack, Table, TableContainer, Typography} from "@mui/material";
import {StyledPaper} from "@/styles/styles";
import TableCount from "@/components/common/tableCount";
import TableEmpty from "@/components/common/TableEmpty";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import LeadTableServices from "@/components/leads/LeadTableServices";
import LeadUrgency from "@/components/leads/shared/LeadUrgency";
import LeadStatusSlide from "@/components/leads/shared/LeadStatusSlide";
import JobStartEndDateProgress from "@/components/jobs/shared/JobStartEndDateProgress";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ExecutiveViewJobs = ({jobs}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Box sx={StyledPaper}>
            <Box className={"heading has-button"}>
                <Stack direction={"row"} gap={"1rem"}>
                    <Typography>Jobs</Typography>
                    <TableCount vertical={true} count={jobs.length}/>
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
                                    <TableCell>Start & End Date</TableCell>
                                    <TableCell></TableCell>
                                </>
                            }
                        </TableRow>
                        {jobs.length > 0 &&
                            <>
                                {jobs.map((row) => (
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
                                                <BusinessNameBlock name={row.lead.business.name}

                                                                   location={row.lead.business.location.name}/>

                                                {isMobile &&
                                                    <LeadTableServices isRow={true} services={row.lead.services}/>
                                                }
                                            </Stack>
                                        </TableCell>
                                        {!isMobile &&
                                            <>
                                                <TableCell>
                                                    <LeadTableServices services={row.lead.services}/>
                                                </TableCell>
                                                <TableCell>
                                                    <LeadUrgency urgency={row.lead.urgency}/>
                                                </TableCell>
                                                <TableCell>
                                                    <LeadStatusSlide lead_status={row.lead.lead_status}/>
                                                </TableCell>
                                                <TableCell>
                                                    <JobStartEndDateProgress job_status={row.status}
                                                                             end_date={row.end_date}
                                                                             start_date={row.start_date}/>
                                                </TableCell>
                                            </>
                                        }
                                    </TableRow>
                                ))}
                            </>
                        }
                    </TableHead>

                    {jobs.length === 0 &&
                        <TableRow>
                            <TableCell component="th" scope="row" colSpan={"5"} align={"center"}>
                                <TableEmpty message={"No jobs to display"}/>
                            </TableCell>
                        </TableRow>
                    }
                </Table>
            </TableContainer>
            <Box sx={{padding: '1rem'}}>

            </Box>
        </Box>
    )
}
export default ExecutiveViewJobs;