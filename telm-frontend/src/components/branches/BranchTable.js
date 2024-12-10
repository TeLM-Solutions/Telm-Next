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
import TableEmpty from "@/components/common/TableEmpty";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

function createData(name, calories, fat, carbs, protein) {
    return {name, calories, fat, carbs, protein};
}

const BranchTable = ({loading, branches, onClickEdit, onClickView, pagination, onTablePageChange, onClickDelete}) => {

    const rowsPerPage = 10;
    const page = 0;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <TableContainer>
                <Table aria-label="simple table">
                    {!isMobile &&
                        <TableHead>
                            <TableRow>
                                <TableCell>Branch</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Branch Manager</TableCell>
                                <TableCell>Total Executives</TableCell>
                                <TableCell>Total Leads</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                    }
                    <TableBody>
                        {branches.length > 0 &&
                            <>
                                {branches.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            '&:last-child td, &:last-child th': {border: 0},
                                            '&:hover': {background: 'linear-gradient(176deg, #dee9ff 0%, transparent 30%)'}
                                        }}
                                    >
                                        <TableCell component="th" scope="row" onClick={() => onClickView(row.id)}>
                                            <Stack direction="row"
                                                   alignItems="center"
                                                   sx={{gap: '0.5rem', cursor: 'pointer'}}>
                                                <ColorBox text={row.name}/>
                                                <Typography varient={"body2"}>{row.name}</Typography>
                                            </Stack>
                                        </TableCell>
                                        {!isMobile &&
                                            <>
                                                <TableCell>
                                                    <Typography sx={{fontWeight: 500}}
                                                                varient={"body2"}>{row.address}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {row.manager &&
                                                        <Stack direction="row"
                                                               alignItems="center"
                                                               sx={{gap: '0.5rem'}}>
                                                            <UserAvatar name={row.manager?.name}/>
                                                            <Typography varient={"body2"}
                                                                        sx={{fontSize: '0.875rem'}}>{row.manager?.name}</Typography>
                                                        </Stack>
                                                    }
                                                    {!row.manager &&
                                                        <Alert severity="error">Not assigned</Alert>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Chip variant={"outlined"} label={row.users_count}/>
                                                </TableCell>
                                                <TableCell><Chip label={row.leads_count}/></TableCell>
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
                                                {row.leads_count == 0 &&
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
                        {branches.length === 0 &&
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={"6"} align={"center"}>
                                    <TableEmpty message={"No branches to display"}/>

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
export default BranchTable;