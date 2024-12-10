import DashboardTableHead from "@/components/dashboard/DashboardTableHead";
import {Card, Divider, Stack, Table, TableBody, TableContainer} from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import CountDownDays from "@/components/common/CountDownDays";
import {useRouter} from "next/router";
import {useAuth} from "@/hooks/auth";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import FollowUpStatusChipSmall from "@/components/followups/shared/FollowUpStatusChipSmall";
import TableEmpty from "@/components/common/TableEmpty";

const DashboardFollowUpsCard = ({followups}) => {
    const {user} = useAuth({middleware: 'auth'})

    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Card sx={{flex: 1}}>

            <DashboardTableHead
                title={"Upcoming Follow Ups"}
                subText={"Follow ups need to close soon"}
                showButton={true}
                onClickButton={() => router.push(`/${user.role}/follow-ups`)}
            />

            <Divider/>

            <TableContainer>
                <Table aria-label="simple table">
                    {!isMobile &&
                        <TableHead>
                            <TableRow sx={{borderBottom: '1px solid #ddd'}}>
                                <TableCell sx={{paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>Lead</TableCell>
                                <TableCell sx={{paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>Date</TableCell>
                                <TableCell sx={{paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>Reason</TableCell>
                            </TableRow>
                        </TableHead>
                    }
                    <TableBody>

                        {followups && followups.length > 0 && followups.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    <Stack direction={"column"} gap={"1rem"}>
                                        <BusinessNameBlock name={row.lead.business.name}

                                                           location={row.lead.business.location.name}/>
                                        <Stack direction={{sx: "column", md: "row"}} gap={"0.5rem"}>
                                            <FollowUpStatusChipSmall status={row.status}/>
                                            {isMobile &&
                                                <CountDownDays targetDate={row.date} jobStatus={row.job.status}
                                                               followUpStatus={row.status} vertical={true}
                                                               targetTime={row.time}/>
                                            }
                                        </Stack>
                                    </Stack>
                                </TableCell>
                                {!isMobile &&
                                    <>
                                        <TableCell>
                                            <CountDownDays targetDate={row.date} jobStatus={row.job.status}
                                                           followUpStatus={row.status} targetTime={row.time}/>
                                        </TableCell>
                                        <TableCell>
                                            {row.reason.title}
                                        </TableCell>
                                    </>
                                }
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>

            {followups && followups.length === 0 &&
                <TableEmpty message={"No followups to display"}/>
            }

        </Card>
    )
}
export default DashboardFollowUpsCard;