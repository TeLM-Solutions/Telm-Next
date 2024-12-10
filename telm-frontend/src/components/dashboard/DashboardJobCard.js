import DashboardTableHead from "@/components/dashboard/DashboardTableHead";
import {Card, CardContent, Divider, Stack, Table, TableBody, TableContainer} from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import JobStartEndDateProgress from "@/components/jobs/shared/JobStartEndDateProgress";
import LeadUrgency from "@/components/leads/shared/LeadUrgency";
import {useAuth} from "@/hooks/auth";
import {useRouter} from "next/router";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LeadStatusChip from "@/components/leads/shared/LeadStatusChip";
import LeadUrgencyChip from "@/components/leads/shared/LeadUrgencyChip";
import TableEmpty from "@/components/common/TableEmpty";

const DashboardJobCard = ({jobs, subText}) => {
    const {user} = useAuth({middleware: 'auth'})
    const router = useRouter();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Card sx={{flex: 1}}>

            <DashboardTableHead
                title={"Recent Jobs"}
                subText={subText}
                showButton={true}
                onClickButton={() => router.push(`/${user.role}/jobs`)}
            />

            <Divider/>

            <TableContainer>
                <Table aria-label="simple table">
                    {!isMobile &&
                        <TableHead>
                            <TableRow sx={{borderBottom: '1px solid #ddd'}}>
                                <TableCell sx={{paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>Lead</TableCell>
                                <TableCell sx={{paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>Start & End
                                    Date</TableCell>
                                <TableCell sx={{paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>Urgency</TableCell>
                            </TableRow>
                        </TableHead>
                    }
                    <TableBody>

                        {jobs && jobs.length > 0 && jobs.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '& td': {
                                        backgroundColor: {
                                            xs: 'rgb(126 126 126 / 4%)',
                                            md: '#fff'
                                        },
                                        padding: {
                                            xs: '1rem 1rem 0',
                                            md: '1rem'
                                        },
                                        borderBottom: {
                                            xs: 'none',
                                            md: '1px solid rgba(224, 224, 224, 1)'
                                        }
                                    },
                                    '&:last-child td, &:last-child th': {
                                        border: 0,
                                        paddingBottom: {
                                            xs: '1rem',
                                            md: '1rem'
                                        }
                                    }
                                }}
                            >
                                <TableCell component="td" scope="row">
                                    {isMobile &&
                                        <Card elavation={3}>
                                            <CardContent>
                                                <Stack direction={"column"} gap={"1rem"}>

                                                    <BusinessNameBlock name={row.lead.business.name}

                                                                       location={row.lead.business.location.name}/>
                                                    <Stack direction={"row"} gap={"1rem"}>
                                                        <LeadStatusChip status={row.status}/>

                                                        <LeadUrgencyChip urgency={row.urgency}/>

                                                    </Stack>
                                                    <Divider/>

                                                    <JobStartEndDateProgress end_date={row.end_date}
                                                                             job_status={row.status}
                                                                             start_date={row.start_date}/>

                                                </Stack>
                                            </CardContent>
                                        </Card>

                                    }
                                    {!isMobile &&
                                        <>
                                            <Stack direction={"column"} gap={"1rem"}>
                                                <BusinessNameBlock name={row.lead.business.name}
                                                                   location={row.lead.business.location.name}/>
                                                <Stack direction={"row"} gap={"1rem"}>
                                                    <LeadStatusChip status={row.status}/>
                                                </Stack>

                                            </Stack>
                                        </>
                                    }
                                </TableCell>
                                {!isMobile &&
                                    <>
                                        <TableCell>
                                            <JobStartEndDateProgress end_date={row.end_date}
                                                                     job_status={row.status}
                                                                     start_date={row.start_date}/>
                                        </TableCell>
                                        <TableCell>
                                            <LeadUrgency urgency={row.lead.urgency}/>
                                        </TableCell>
                                    </>

                                }
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>

            {jobs && jobs.length === 0 &&
                <TableEmpty message={"No jobs to display"}/>
            }
        </Card>
    )
}
export default DashboardJobCard;