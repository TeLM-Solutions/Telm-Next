import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Box, Chip, Divider, IconButton, Stack, TablePagination, Typography} from "@mui/material";
import Icon from "../common/Icon";
import ViewIcon from "../../../public/images/icons/view.svg";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import LeadTableServices from "@/components/leads/LeadTableServices";
import JobStartEndDateProgress from "@/components/jobs/shared/JobStartEndDateProgress";
import CountDownDays from "@/components/common/CountDownDays";
import FollowUpStatusChip from "@/components/followups/shared/FollowUpStatusChip";
import TableEmpty from "@/components/common/TableEmpty";
import {useAuth} from "@/hooks/auth";
import LeadUrgencyChip from "@/components/leads/shared/LeadUrgencyChip";
import React from "react";
import LeadStatusTiny from "@/components/leads/shared/LeadStatusTiny";
import FollowupContactType from "@/components/followups/shared/FollowupContactType";
import ColorBox from "@/components/common/ColorBox";
import LeadStageChanger from "@/components/leads/dialog/info/LeadStageChanger";


const FollowUpTable = ({loading, followups, onViewClick, pagination, onTablePageChange}) => {

    const {user} = useAuth({middleware: 'auth'})

    const rowsPerPage = 10;
    const page = 0;

    return (
        <>
            <TableContainer>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Lead Info</TableCell>
                            <TableCell>Total Followups</TableCell>
                            <TableCell>Job Start & End Date</TableCell>
                            <TableCell>Last Follow Up Date</TableCell>
                            <TableCell>Last Reason</TableCell>
                            <TableCell align={"right"}>Last Status</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {followups.length > 0 &&
                            <>
                                {followups.map((row) => {

                                    return (
                                        <TableRow
                                            key={row.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Stack direction={"column"} gap={"0.5rem"}>
                                                    <Box onClick={() => onViewClick(row.id)}>
                                                        <BusinessNameBlock name={row.lead.business.name}
                                                                           location={row.lead.business.location.name}/>
                                                    </Box>


                                                    <Stack direction={"row"} gap={"2rem"} alignItems={"center"}>
                                                        <LeadStatusTiny lead_status={row.lead.lead_status}/>

                                                        {user.role === 'admin' && row.branch &&
                                                            <Stack direction="row"
                                                                   alignItems="center"
                                                                   sx={{gap: '0.5rem', cursor: 'pointer'}}>
                                                                <ColorBox text={row.branch.name} tiny={true}/>
                                                                <Typography
                                                                    sx={{fontSize: '0.75rem'}}
                                                                    varient={"body2"}>{row.branch.name}</Typography>
                                                            </Stack>
                                                        }
                                                        {row.followups[0].contact_type &&
                                                            <FollowupContactType type={row.followups[0].contact_type}
                                                                                 isSmall={true}/>
                                                        }
                                                        <Stack direction={"row"} gap={"1rem"}>
                                                            <LeadUrgencyChip urgency={row.lead.urgency}/>
                                                            <LeadStageChanger leadId={row.lead.id}
                                                                              stage={row.lead.stage}
                                                                              isSmall={true} showTitle={false}/>
                                                        </Stack>
                                                    </Stack>
                                                    <Divider/>

                                                    <LeadTableServices isRow={true} services={row.lead.services}/>


                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={row.followups.length}/>
                                            </TableCell>
                                            <TableCell>
                                                <JobStartEndDateProgress job_status={row.status}
                                                                         end_date={row.end_date}
                                                                         start_date={row.start_date}/>
                                            </TableCell>
                                            <TableCell>
                                                <CountDownDays jobStatus={row.status}
                                                               followUpStatus={row.followups[0].status}
                                                               targetDate={row.followups[0].date}
                                                               targetTime={row.followups[0].time}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{}}>

                                                    <Typography sx={{
                                                        color: 'rgba(41, 41, 41, 0.87)',
                                                        fontSize: '0.875rem',
                                                        maxWidth: '5rem',
                                                        lineHeight: '1.34063rem',
                                                    }}>
                                                        {row.followups[0].reason.title}
                                                    </Typography>

                                                </Box>
                                            </TableCell>

                                            <TableCell align={"right"}>

                                                <FollowUpStatusChip status={row.followups[0].status}/>

                                            </TableCell>
                                            <TableCell align={"right"}>
                                                <Stack direction="row"
                                                       alignItems="center"
                                                       justifyContent="flex-end"
                                                       sx={{gap: '0.5rem'}}>
                                                    <IconButton aria-label="edit" size="large"
                                                                onClick={() => onViewClick(row.id)}>
                                                        <Icon src={ViewIcon} height={20} width={20}/>
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </>
                        }
                        {followups.length === 0 &&
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={"6"} align={"center"}>
                                    <TableEmpty message={"No followups to display"}/>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>

                </Table>
            </TableContainer>
            {followups.length > 0 && pagination &&
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={pagination.total}
                    rowsPerPage={pagination.per_page}
                    page={pagination.current_page - 1}
                    onPageChange={onTablePageChange}
                />
            }
        </>
    )
}
export default FollowUpTable;