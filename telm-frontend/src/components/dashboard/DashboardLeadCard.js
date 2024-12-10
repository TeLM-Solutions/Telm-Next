import DashboardTableHead from "@/components/dashboard/DashboardTableHead";
import {Card, Divider, Stack, Table, TableBody, TableContainer} from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import LeadTableServices from "@/components/leads/LeadTableServices";
import {useAuth} from "@/hooks/auth";
import {useRouter} from "next/router";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LeadStatusChip from "@/components/leads/shared/LeadStatusChip";
import LeadUrgencyChip from "@/components/leads/shared/LeadUrgencyChip";
import LeadStatusTiny from "@/components/leads/shared/LeadStatusTiny";
import TableEmpty from "@/components/common/TableEmpty";

const DashboardLeadCard = ({leads, subText}) => {
    const {user} = useAuth({middleware: 'auth'})
    const router = useRouter();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Card sx={{
            flex: {
                sx: 1,
                md: 0.8,
                xl: 0.6
            }
        }}>

            <DashboardTableHead
                title={"Recent Leads"}
                subText={subText}
                showButton={true}
                onClickButton={() => router.push(`/${user.role}/leads`)}
            />

            <Divider/>

            <TableContainer>
                <Table aria-label="simple table">
                    {!isMobile &&
                        <TableHead>
                            <TableRow sx={{borderBottom: '1px solid #ddd'}}>
                                <TableCell sx={{paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>Lead</TableCell>

                                <TableCell sx={{paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>Services</TableCell>

                            </TableRow>
                        </TableHead>
                    }
                    <TableBody>

                        {leads && leads.length > 0 && leads.map((row) => {
                                return (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            '&:last-child td, &:last-child th': {border: 0}
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Stack direction={"column"} gap={"0.5rem"}>
                                                <BusinessNameBlock name={row.business.name}

                                                                   location={row.business.location.name}/>

                                                <Stack direction={"row"} gap={"0.5rem"}>
                                                    <LeadStatusChip status={row.status}/>
                                                    <LeadUrgencyChip urgency={row.urgency}/>
                                                    <LeadStatusTiny lead_status={row.lead_status}/>
                                                </Stack>
                                            </Stack>

                                        </TableCell>
                                        {!isMobile &&
                                            <>
                                                <TableCell>
                                                    <LeadTableServices services={row.services}/>
                                                </TableCell>
                                            </>
                                        }
                                    </TableRow>
                                )
                            }
                        )}


                    </TableBody>
                </Table>
            </TableContainer>
            {leads && leads.length === 0 &&
                <TableEmpty message={"No leads to display"}/>
            }

        </Card>
    )
}
export default DashboardLeadCard;