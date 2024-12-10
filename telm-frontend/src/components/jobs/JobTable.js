import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Chip, IconButton, Stack, TablePagination, Typography} from "@mui/material";
import Icon from "../common/Icon";
import EditIcon from "../../../public/images/icons/edit.svg";
import ViewIcon from "../../../public/images/icons/view.svg";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import UserAvatar from "@/components/common/UserAvatar";
import {relativeTimeUtil} from "@/lib/relativeTime";
import LeadUrgency from "@/components/leads/shared/LeadUrgency";
import LeadTableServices from "@/components/leads/LeadTableServices";
import JobStartEndDateProgress from "@/components/jobs/shared/JobStartEndDateProgress";
import TableEmpty from "@/components/common/TableEmpty";
import ColorBox from "@/components/common/ColorBox";
import LeadStatusChip from "@/components/leads/shared/LeadStatusChip";
import React from "react";
import LeadStageChanger from "@/components/leads/dialog/info/LeadStageChanger";
import LeadStatusTiny from "@/components/leads/shared/LeadStatusTiny";


const JobTable = ({loading, jobs, onClickEdit, user, onViewClick, pagination, onTablePageChange}) => {

    const rowsPerPage = 10;
    const page = 0;

    return (
        <>
            <TableContainer>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Lead</TableCell>
                            <TableCell>Lead Services</TableCell>
                            <TableCell>Lead Urgency</TableCell>
                            {user.role !== 'executive' &&
                                <TableCell>Assigned To</TableCell>
                            }
                            <TableCell>Start and End Date</TableCell>
                            {/*<TableCell align={"right"}>Status</TableCell>*/}
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {jobs.length > 0 &&
                            <>
                                {jobs.map((row) => {

                                    return (
                                        <TableRow
                                            key={row.id}
                                            sx={{
                                                '&:last-child td, &:last-child th': {border: 0},
                                                '&:hover': {background: 'linear-gradient(176deg, #dee9ff 0%, transparent 30%)'}
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Stack direction={"column"} gap={"0.5rem"}
                                                >
                                                    <Stack onClick={() => onViewClick(row.id)}>
                                                        <BusinessNameBlock name={row.lead.business.name}
                                                                           location={row.lead.business.location.name}/>
                                                    </Stack>

                                                    {user.role === 'admin' &&
                                                        <Stack direction={"row"} gap={"1rem"}
                                                               onClick={() => onViewClick(row.id)}>
                                                            <Chip
                                                                variant={"outlined"}
                                                                label={
                                                                    <Stack direction={"row"} gap={"0.5rem"}
                                                                           alignItems={"center"}>
                                                                        <ColorBox text={row.lead.branch.name}/>
                                                                        <Typography sx={{fontSize: '0.85rem'}}>
                                                                            Branch: <strong>{row.lead.branch.name}</strong>
                                                                        </Typography>
                                                                    </Stack>
                                                                }/>
                                                        </Stack>
                                                    }
                                                    <Stack direction={"row"} gap={"1rem"}>
                                                        <LeadStatusTiny lead_status={row.lead.lead_status}/>
                                                        <LeadStatusChip status={row.status}
                                                        />
                                                        <LeadStageChanger leadId={row.lead.id} stage={row.lead.stage}
                                                                          isSmall={true} showTitle={false}/>
                                                    </Stack>
                                                </Stack>

                                            </TableCell>
                                            <TableCell>
                                                <LeadTableServices services={row.lead.services}/>
                                            </TableCell>
                                            <TableCell>
                                                <LeadUrgency urgency={row.lead.urgency}/>
                                            </TableCell>

                                            {user.role !== 'executive' &&
                                                <TableCell>
                                                    <Stack direction="row"
                                                           alignItems="center"
                                                           sx={{gap: '0.5rem'}}>
                                                        <UserAvatar name={row.user.name}/>
                                                        <Stack>
                                                            <Typography varient={"body2"}
                                                                        sx={{fontSize: '0.875rem'}}>{row.user.name}</Typography>
                                                            <Typography varient={"body2"}
                                                                        sx={{fontSize: '0.75rem'}}>{relativeTimeUtil(row.created_at)}</Typography>
                                                        </Stack>

                                                    </Stack>
                                                </TableCell>
                                            }
                                            <TableCell>

                                                <JobStartEndDateProgress end_date={row.end_date}
                                                                         start_date={row.start_date}
                                                                         job_status={row.status}/>

                                            </TableCell>

                                            <TableCell align={"right"}>
                                                <Stack direction="row"
                                                       alignItems="center"
                                                       justifyContent="flex-end"
                                                       sx={{gap: '0.5rem'}}>
                                                    <IconButton onClick={() => onViewClick(row.id)}
                                                                aria-label="edit"
                                                                size="large">
                                                        <Icon src={ViewIcon} height={20} width={20}/>
                                                    </IconButton>
                                                    {user.role === 'manager' && row.status == 1 &&
                                                        <>
                                                            <IconButton aria-label="view" size="large"
                                                                        onClick={() => onClickEdit(row.id)}>
                                                                <Icon src={EditIcon} height={20} width={21}/>
                                                            </IconButton>
                                                            {/*<IconButton aria-label="delete" size="large">*/}
                                                            {/*    <Icon src={DeleteIcon} height={20} width={20}/>*/}
                                                            {/*</IconButton>*/}
                                                        </>
                                                    }
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </>
                        }
                        {jobs.length === 0 &&
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={"7"} align={"center"}>
                                    <TableEmpty message={"No jobs to display"}/>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {jobs.length > 0 && pagination &&
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
export default JobTable;