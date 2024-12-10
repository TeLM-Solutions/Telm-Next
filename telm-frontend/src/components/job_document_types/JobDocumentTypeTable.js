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
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const JobDocumentTypeTable = ({loading, job_document_types, onClickEdit, onClickDelete}) => {

    const rowsPerPage = 10;
    const page = 0;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));


    return (
        <>
            <TableContainer>
                <Table aria-label="simple table" size="small">
                    {!isMobile &&
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Total Documents</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                    }
                    {!loading &&
                        <TableBody>
                            {job_document_types.length > 0 &&
                                <>
                                    {job_document_types.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Stack direction="row"
                                                       alignItems="center"
                                                       sx={{gap: '0.5rem'}}>
                                                    <ColorBox text={row.title}/>
                                                    <Typography varient={"body2"}>{row.title}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <Chip label={row.documents_count}/>
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
                                                    {row.documents_count == 0 &&
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
                            {job_document_types.length === 0 &&
                                <TableRow>
                                    <TableCell component="th" scope="row" colSpan={"6"} align={"center"}>
                                        <TableEmpty message={"No data to display"}/>
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
            {!loading && job_document_types.length > 0 &&
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={job_document_types.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={() => console.log('page change')}
                    // onRowsPerPageChange={handleChangeRowsPerPage}
                />
            }
        </>
    )
}
export default JobDocumentTypeTable;