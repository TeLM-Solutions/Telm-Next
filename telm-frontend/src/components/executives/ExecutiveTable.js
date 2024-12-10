import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Chip, IconButton, Stack, TablePagination, Tooltip, Typography} from "@mui/material";
import Icon from "../common/Icon";
import DeleteIcon from "../../../public/images/icons/delete.svg";
import EditIcon from "../../../public/images/icons/edit.svg";
import ViewIcon from "../../../public/images/icons/view.svg";
import {dateFormat, relativeTimeUtil} from "@/lib/relativeTime";
import TableEmpty from "@/components/common/TableEmpty";
import ExecutiveName from "@/components/executives/shared/ExecutiveName";
import JobClosed from "@/components/executives/shared/JobClosed";
import React from "react";

const ExecutiveTable = ({
                            loading,
                            executives,
                            onClickEdit,
                            onClickView,
                            pagination,
                            onTablePageChange,
                            onClickDelete
                        }) => {

    return (
        <>
            <TableContainer>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Contact Number</TableCell>
                            <TableCell>Total Leads</TableCell>
                            <TableCell>Jobs</TableCell>
                            <TableCell>Last Login</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {executives.length > 0 &&
                            <>
                                {executives.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            '&:last-child td, &:last-child th': {border: 0},
                                            '&:hover': {background: 'linear-gradient(176deg, #dee9ff 0%, transparent 30%)'}
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <ExecutiveName onClickView={onClickView} name={row.name}
                                                           email={row.email} id={row.id}/>


                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{fontWeight: 500}}
                                                        varient={"body2"}>{row.contact_number}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={row.total_leads}/>
                                        </TableCell>
                                        <TableCell>
                                            {parseInt(row.total_jobs, 10) > 0 &&
                                                <JobClosed total_jobs={row.total_jobs}
                                                           jobs_closed={row.jobs_closed}/>
                                            }
                                            {
                                                parseInt(row.total_jobs, 10) == 0 &&
                                                <Chip label={"No jobs assigned"}/>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title={row.last_login ? dateFormat(row.created_at) : ""}
                                                     arrow
                                                     placement="top">
                                                <Chip
                                                    variant={row.last_login ? "outlined" : 'filled'}
                                                    sx={{width: 'fit-content'}}
                                                    label={row.last_login ? `Last Login: ${relativeTimeUtil(row.last_login)}` : 'Never'}/>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align={"right"}>

                                            <Stack direction="row"
                                                   alignItems="center"
                                                   justifyContent="flex-end"
                                                   sx={{gap: '0.5rem'}}>

                                                <IconButton onClick={() => onClickView(row.id)} aria-label="edit"
                                                            size="large">
                                                    <Icon src={ViewIcon} height={20} width={20}/>
                                                </IconButton>
                                                <IconButton aria-label="view" size="large"
                                                            onClick={() => onClickEdit(row.id)}>
                                                    <Icon src={EditIcon} height={20} width={21}/>
                                                </IconButton>
                                                {row.total_leads == 0 && row.total_jobs == 0 &&
                                                    <IconButton aria-label="delete" size="large"
                                                                onClick={() => onClickDelete(row.id)}>
                                                        <Icon src={DeleteIcon} height={20} width={20}/>
                                                    </IconButton>
                                                }
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        }
                        {executives.length === 0 &&
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={"6"} align={"center"}>
                                    <TableEmpty message={"No executives to display"}/>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>

                </Table>
            </TableContainer>
            {executives.length > 0 && pagination &&
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
export default ExecutiveTable;