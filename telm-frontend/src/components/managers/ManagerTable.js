import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Alert, Chip, IconButton, Stack, TablePagination, Typography} from "@mui/material";
import ColorBox from "../common/ColorBox";
import UserAvatar from "../common/UserAvatar";
import Icon from "../common/Icon";
import DeleteIcon from "../../../public/images/icons/delete.svg";
import EditIcon from "../../../public/images/icons/edit.svg";
import ViewIcon from "../../../public/images/icons/view.svg";
import {relativeTimeUtil} from "@/lib/relativeTime";
import TableEmpty from "@/components/common/TableEmpty";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from 'react';

const ManagerTable = ({loading, managers, onClickEdit, onClickView, pagination, onTablePageChange, onClickDelete}) => {

    console.log(pagination)

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <TableContainer sx={{minHeight: 320}}>
                <Table aria-label="simple table">
                    {!isMobile &&
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Contact Number</TableCell>
                                <TableCell>Email Address</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Last Login</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                    }

                    <TableBody>
                        {managers && managers.length > 0 &&
                            <>
                                {managers.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            '&:last-child td, &:last-child th': {border: 0},
                                            '&:hover': {background: 'linear-gradient(176deg, #dee9ff 0%, transparent 30%)'}
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Stack direction="row"
                                                   onClick={() => onClickView(row.id)}
                                                   alignItems="center"
                                                   sx={{gap: '0.5rem', cursor: 'pointer'}}>
                                                <UserAvatar name={row.name}/>
                                                <Typography varient={"body2"}
                                                            sx={{fontSize: '0.875rem'}}>{row.name}</Typography>
                                            </Stack>
                                        </TableCell>
                                        {!isMobile &&
                                            <>
                                                <TableCell>
                                                    <Typography sx={{fontWeight: 500}}
                                                                varient={"body2"}>{row.contact_number}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{fontWeight: 500}}
                                                                varient={"body2"}>{row.email}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {row.managed_branch &&
                                                        <Stack direction="row"
                                                               alignItems="center"
                                                               sx={{gap: '0.5rem'}}>
                                                            <ColorBox text={row.managed_branch?.name}/>
                                                            <Typography
                                                                varient={"body2"}>{row.managed_branch?.name}</Typography>
                                                        </Stack>
                                                    }
                                                    {!row.managed_branch &&
                                                        <Alert severity="error">Not assigned</Alert>
                                                    }
                                                </TableCell>
                                                <TableCell><Chip
                                                    variant={row.last_login ? "outlined" : 'filled'}
                                                    label={row.last_login ? relativeTimeUtil(row.last_login) : 'Never'}/></TableCell>
                                            </>
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
                                                <IconButton aria-label="view" size="large"
                                                            onClick={() => onClickEdit(row.id)}>
                                                    <Icon src={EditIcon} height={20} width={21}/>
                                                </IconButton>
                                                {!row.managed_branch &&
                                                    <IconButton aria-label="delete" size="large"
                                                                onClick={() => onClickDelete(row.id)}>
                                                        <Icon src={DeleteIcon} height={20} width={20}/>
                                                    </IconButton>
                                                }                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        }
                        {!loading && managers && managers.length === 0 &&
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={"6"} align={"center"}>
                                    <TableEmpty message={"No managers to display"}/>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>

                </Table>
            </TableContainer>
            {pagination &&
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
export default React.memo(ManagerTable);