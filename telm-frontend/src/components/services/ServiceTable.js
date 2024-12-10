import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Chip, CircularProgress, IconButton, Stack, TablePagination, Typography} from "@mui/material";
import Icon from "../common/Icon";
import DeleteIcon from "../../../public/images/icons/delete.svg";
import EditIcon from "../../../public/images/icons/edit.svg";
import ColorBox from "@/components/common/ColorBox";
import TableEmpty from "@/components/common/TableEmpty";

const ServiceTable = ({loading, services, onClickEdit, onClickDelete}) => {

    const rowsPerPage = 10;
    const page = 0;

    return (
        <>
            <TableContainer>
                <Table aria-label="simple table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Leads</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    {!loading &&
                        <TableBody>
                            {services.length > 0 &&
                                <>
                                    {services.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Stack direction="row"
                                                       alignItems="center"
                                                       sx={{gap: '0.5rem'}}>
                                                    <ColorBox text={row.name}/>
                                                    <Typography varient={"body2"}>{row.name}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={row.leads_count ? row.leads_count : 0}/>
                                            </TableCell>
                                            <TableCell align={"right"}>

                                                <Stack direction="row"
                                                       alignItems="center"
                                                       justifyContent="flex-end"
                                                       sx={{gap: '0.5rem'}}>
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
                            {services.length === 0 &&
                                <TableRow>
                                    <TableCell component="th" scope="row" colSpan={"6"} align={"center"}>
                                        <TableEmpty message={"No services to display"}/>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    }
                    {loading &&
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" colSpan={"6"} align={"center"}>
                                    <CircularProgress size={'1.5rem'}/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    }
                </Table>
            </TableContainer>
            {!loading && services.length > 0 &&
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={services.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={() => console.log('page change')}
                    // onRowsPerPageChange={handleChangeRowsPerPage}
                />
            }
        </>
    )
}
export default ServiceTable;