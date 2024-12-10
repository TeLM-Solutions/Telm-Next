import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Alert, Button, Chip, IconButton, Stack, TablePagination, Tooltip, Typography,} from "@mui/material";
import Icon from "../common/Icon";
import EditIcon from "../../../public/images/icons/edit.svg";
import ViewIcon from "../../../public/images/icons/view.svg";
import {dateFormat, relativeTimeUtil} from "@/lib/relativeTime";
import UserAvatar from "@/components/common/UserAvatar";
import LeadTableServices from "@/components/leads/LeadTableServices";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import LeadUrgency from "@/components/leads/shared/LeadUrgency";
import LeadStatusSlide from "@/components/leads/shared/LeadStatusSlide";
import TableEmpty from "@/components/common/TableEmpty";
import ColorBox from "@/components/common/ColorBox";
import LeadStatusChip from "@/components/leads/shared/LeadStatusChip";
import React from "react";
import TableExtraButtons from "@/components/leads/shared/TableExtraButtons";
import {PersonAddAlt1Outlined} from "@mui/icons-material";
import LeadStageChanger from "@/components/leads/dialog/info/LeadStageChanger";

const LeadTable = ({
                       loading,
                       leads,
                       onClickEdit,
                       onClickView,
                       user,
                       pagination,
                       onTablePageChange,
                       onClickDelete,
                       onClickHold,
                       onClickAssignClick
                   }) => {

    const rowsPerPage = 10;
    const page = 0;

    return (
        <>
            <TableContainer>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Business</TableCell>
                            <TableCell>Services</TableCell>
                            <TableCell>Urgency</TableCell>
                            <TableCell>Lead Classification</TableCell>
                            {user.role !== 'executive' &&
                                <>
                                    <TableCell>Created By</TableCell>
                                    <TableCell>Job Assigned To</TableCell>
                                </>
                            }
                            {user.role === 'executive' &&
                                <TableCell align={"right"}>Created At</TableCell>
                            }
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {leads.length > 0 &&
                            <>
                                {leads.map((row) => {

                                        return (
                                            <TableRow
                                                key={row.id}
                                                sx={{
                                                    '&:last-child td, &:last-child th': {border: 0},
                                                    '&:hover': {background: 'linear-gradient(176deg, #dee9ff 0%, transparent 30%)'}
                                                }}
                                            >
                                                <TableCell component="th" scope="row"
                                                >
                                                    <Stack direction={"column"} gap={"0.5rem"}>
                                                        <Stack onClick={() => onClickView(row.id)}>
                                                            <BusinessNameBlock name={row.business.name}

                                                                               location={row.business.location.name}/>
                                                        </Stack>

                                                        {user.role === 'admin' &&
                                                            <Stack direction={"row"} gap={"1rem"}
                                                                   onClick={() => onClickView(row.id)}>
                                                                <Chip
                                                                    variant={"outlined"}
                                                                    label={
                                                                        <Stack direction={"row"} gap={"0.5rem"}
                                                                               alignItems={"center"}>
                                                                            <ColorBox text={row.branch.name}/>
                                                                            <Typography sx={{fontSize: '0.85rem'}}>
                                                                                Branch: <strong>{row.branch.name}</strong>
                                                                            </Typography>
                                                                        </Stack>
                                                                    }/>
                                                            </Stack>
                                                        }
                                                        <Stack direction={"row"} gap={"1rem"}
                                                        >
                                                            <LeadStatusChip status={row.status}/>
                                                            <LeadStageChanger leadId={row.id} stage={row.stage}
                                                                              isSmall={true} showTitle={false}/>
                                                        </Stack>

                                                    </Stack>

                                                </TableCell>
                                                <TableCell>
                                                    <LeadTableServices services={row.services}/>
                                                </TableCell>
                                                <TableCell>
                                                    <LeadUrgency urgency={row.urgency}/>
                                                </TableCell>
                                                <TableCell>
                                                    <LeadStatusSlide lead_status={row.lead_status}/>
                                                </TableCell>
                                                {user.role === 'executive' &&
                                                    <TableCell align={"right"}>
                                                        <Tooltip title={dateFormat(row.created_at)} arrow
                                                                 placement="top">
                                                            <Chip
                                                                variant={row.created_at ? "outlined" : 'filled'}
                                                                label={row.created_at ? relativeTimeUtil(row.created_at) : ''}/>
                                                        </Tooltip>

                                                    </TableCell>
                                                }
                                                {user.role !== 'executive' &&
                                                    <TableCell>
                                                        <Stack direction="row"
                                                               alignItems="center"
                                                               sx={{gap: '0.5rem'}}>
                                                            <UserAvatar name={row.user.name}/>
                                                            <Stack>
                                                                <Typography varient={"body2"}
                                                                            sx={{
                                                                                fontSize: '0.875rem',
                                                                                maxWidth: 120
                                                                            }}>{row.user.name}</Typography>
                                                                <Typography varient={"body2"}
                                                                            sx={{fontSize: '0.75rem'}}>{relativeTimeUtil(row.created_at)}</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </TableCell>
                                                }
                                                {user.role !== 'executive' &&
                                                    <TableCell>
                                                        {!row.job &&
                                                            <>
                                                                {user.role !== 'manager' &&
                                                                    <Alert sx={{width: 'fit-content'}}
                                                                           severity="warning">Unassigned</Alert>
                                                                }

                                                                {row.status == 3 && user.role === 'manager' &&
                                                                    <Alert sx={{width: 'fit-content'}}
                                                                           severity="warning">Lead is on Hold.</Alert>
                                                                }

                                                                {row.status != 3 && user.role === 'manager' &&
                                                                    <Button variant={"outlined"}
                                                                            size={"small"}
                                                                            onClick={() => onClickAssignClick(row.id)}
                                                                            startIcon={<PersonAddAlt1Outlined/>}>Assign
                                                                        Job</Button>
                                                                }

                                                            </>

                                                        }
                                                        {row.job && row.job.user &&
                                                            <Stack direction="row"
                                                                   alignItems="center"
                                                                   sx={{gap: '0.5rem'}}>
                                                                <UserAvatar name={row.job.user.name}/>
                                                                <Stack>
                                                                    <Typography varient={"body2"}
                                                                                sx={{fontSize: '0.875rem'}}>{row.job.user.name}</Typography>
                                                                    <Typography varient={"body2"}
                                                                                sx={{fontSize: '0.75rem'}}>{relativeTimeUtil(row.job.created_at)}</Typography>
                                                                </Stack>
                                                            </Stack>
                                                        }
                                                    </TableCell>
                                                }
                                                <TableCell align={"right"}>

                                                    <Stack direction="row"
                                                           alignItems="center"
                                                           justifyContent="flex-end"
                                                           sx={{gap: '0.5rem'}}>
                                                        <IconButton aria-label="edit" size="large"
                                                                    onClick={() => onClickView(row.id)}>
                                                            <Icon src={ViewIcon} height={20} width={20}/>
                                                        </IconButton>
                                                        {user.role === 'executive' && row.job_count == 0 &&
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
                                                        {user.role === 'manager' && row.job_count == 0 &&
                                                            <>
                                                                {row.user.id == user.id &&
                                                                    <IconButton aria-label="view" size="large"
                                                                                onClick={() => onClickEdit(row.id)}>
                                                                        <Icon src={EditIcon} height={20} width={21}/>
                                                                    </IconButton>
                                                                }
                                                                <TableExtraButtons
                                                                    onClickDelete={onClickDelete}
                                                                    onClickHold={onClickHold}
                                                                    leadStatus={row.status}
                                                                    canDelete={row.user.id == user.id}
                                                                    id={row.id}/>
                                                            </>

                                                        }
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                )}
                            </>
                        }
                        {leads.length === 0 &&
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={"6"} align={"center"}>
                                    <TableEmpty message={"No leads to display"}/>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>

                </Table>
            </TableContainer>
            {
                leads.length > 0 && pagination &&
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
export default LeadTable;