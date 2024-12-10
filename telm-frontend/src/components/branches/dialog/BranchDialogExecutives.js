import {Box, Chip, Divider, Stack, Table, TableContainer, Typography} from "@mui/material";
import {StyledPaper} from '@/styles/styles';
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import UserAvatar from "@/components/common/UserAvatar";
import TableEmpty from "@/components/common/TableEmpty";

const BranchDialogExecutives = ({executives}) => {
    return (
        <>
            <Box sx={StyledPaper}>
                <Box className={"heading has-button"}>
                    <Typography>Executives</Typography>
                </Box>
                <Divider/>
                <TableContainer>
                    <Table size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Contact Number</TableCell>
                                <TableCell>Total Leads</TableCell>
                                <TableCell>Jobs Assigned</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {executives.length > 0 &&
                                <>
                                    {executives.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Stack direction="row"
                                                       alignItems="center"
                                                       sx={{gap: '0.5rem'}}>
                                                    <UserAvatar name={row.name}/>
                                                    <Stack>
                                                        <Typography varient={"body2"}
                                                                    sx={{fontSize: '0.875rem'}}>{row.name}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{fontWeight: 500}}
                                                            varient={"body2"}>{row.contact_number}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={row.leads.length}/>

                                            </TableCell>
                                            <TableCell>
                                                <Chip label={row.jobs.length}/>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            }
                            {executives.length === 0 &&
                                <TableRow>
                                    <TableCell component="th" scope="row" colSpan={"5"} align={"center"}>
                                        <TableEmpty message={"No executives to display"}/>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>


                    </Table>
                </TableContainer>
            </Box>


        </>
    )
}

export default BranchDialogExecutives;