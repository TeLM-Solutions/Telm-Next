import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Collapse,
    Divider,
    IconButton,
    Paper,
    Stack,
    TablePagination,
    Typography
} from "@mui/material";
import {useState} from "react";
import ColorBox from "@/components/common/ColorBox";
import LocationColorIcon from "@/components/common/LocationColorIcon";
import Icon from "@/components/common/Icon";
import EditIcon from "../../../public/images/icons/edit.svg";
import DeleteIcon from "../../../public/images/icons/delete.svg";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TableEmpty from "@/components/common/TableEmpty";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Row = (props) => {

    const {row, onClickEdit, isMobile, onClickEditLocation, onClickDelete, onClickDeleteLocation} = props;
    const [open, setOpen] = useState(null);
    return (
        <>
            <TableRow
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
                <TableCell sx={{width: 30}}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Stack direction="row"
                           alignItems="center"
                           sx={{gap: '0.5rem'}}>
                        <ColorBox text={row.name}/>
                        <Typography varient={"body2"}>{row.name}</Typography>
                    </Stack>
                </TableCell>

                {!isMobile &&
                    <>
                        <TableCell>
                            <Chip label={row.locations.length}/>
                        </TableCell>
                        <TableCell>
                            <Chip variant={"outlined"} label={row.total_business_count || 0}/>
                        </TableCell>
                    </>

                }

                <TableCell align={"right"}>

                    <Stack direction="row"
                           alignItems="center"
                           justifyContent="flex-end"
                           sx={{gap: '0.5rem'}}>
                        <IconButton aria-label="view" size="large"
                                    onClick={() => onClickEdit(row.id)}>
                            <Icon src={EditIcon} height={20} width={21}/>
                        </IconButton>
                        {row.locations.length === 0 &&
                            <IconButton aria-label="delete" size="large" onClick={() => onClickDelete(row.id)}>
                                <Icon src={DeleteIcon} height={20} width={20}/>
                            </IconButton>
                        }
                    </Stack>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell sx={{padding: 0, borderBottom: 'none'}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box
                            sx={{
                                background: 'linear-gradient(156deg, #E9FAFF 0%, #F0F0FF 100%)',
                                padding: '2rem'
                            }}>


                            <Paper sx={{width: '100%', marginBottom: '1rem', padding: '0.5rem 1rem'}}>
                                <Stack direction="row" gap={"0.5rem"} alignItems={"center"}
                                       justifyContent={"space-between"} flexWrap={"wrap"}>

                                    <Typography variant="h6" component="h6"
                                                sx={{fontSize: '1rem'}}>
                                        Locations
                                    </Typography>

                                    <Button onClick={() => props.handleAddLocations(row)} color="secondary" size="small"
                                            variant={"contained"}
                                            startIcon={<AddLocationAltIcon/>}>Add new
                                        locations</Button>
                                </Stack>

                            </Paper>


                            <Stack direction="row" gap={"1rem"} flexWrap={"wrap"}>
                                {row.locations.map((location) => (
                                    <Paper
                                        sx={{
                                            minWidth: {
                                                xs: '100%',
                                                md: '9rem'
                                            }, padding: '1rem', position: 'relative',
                                            display: 'flex', gap: '1rem',

                                        }}

                                        key={location.id}>
                                        <Stack gap={"1rem"} sx={{

                                            flex: {
                                                xs: 1,
                                                md: 'none'
                                            }

                                        }}>
                                            <Stack direction="row" gap={"0.5rem"} alignItems={"center"}>
                                                <LocationColorIcon text={location.name}/>
                                                <Typography sx={{fontSize: '1rem'}}>{location.name}</Typography>
                                            </Stack>
                                            <Divider/>
                                            <Stack>
                                                <Stack direction="row" gap={"0.5rem"} alignItems={"center"}>
                                                    <CorporateFareOutlinedIcon fontSize={"tiny"}/>
                                                    <Typography sx={{fontSize: '0.875rem'}}>Businesses</Typography>
                                                </Stack>
                                                <Typography sx={{
                                                    fontSize: '1rem',
                                                    fontWeight: 500
                                                }}>{location.business_count}</Typography>
                                            </Stack>
                                        </Stack>
                                        <Divider orientation="vertical" flexItem/>


                                        <Stack
                                            direction="row"
                                            className={isMobile ? "" : "options"}
                                            gap={"0.5rem"}
                                            alignItems="center"
                                            sx={{
                                                display: 'flex'
                                            }}
                                        >
                                            <IconButton aria-label="Edit" size={"small"}
                                                        onClick={() => onClickEditLocation(row.id, location.id)}>
                                                <ModeEditOutlineIcon sx={{fontSize: 16}}/>
                                            </IconButton>
                                            {location.business_count == 0 &&
                                                <IconButton aria-label="Delete" color={"error"} size={"small"}
                                                            onClick={() => onClickDeleteLocation(location.id)}>
                                                    <HighlightOffIcon sx={{fontSize: 16}}/>
                                                </IconButton>
                                            }
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>


                        </Box>
                        <Divider/>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )

}
const RouteTable = ({
                        loading,
                        routes,
                        onClickEdit,
                        onClickAddLocations,
                        onClickEditLocation,
                        onClickDelete,
                        onClickDeleteLocation
                    }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));


    const rowsPerPage = 10;
    const page = 0;

    return (
        <>
            <TableContainer>
                <Table aria-label="simple table">
                    {!isMobile &&
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{width: 30}}></TableCell>
                                <TableCell>Route Name</TableCell>

                                <TableCell>Total Locations</TableCell>
                                <TableCell>Total Businesses</TableCell>

                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                    }
                    {!loading &&
                        <TableBody>
                            {routes.length > 0 &&
                                <>
                                    {routes.map((row) => (
                                        <Row key={row.id} row={row} onClickEdit={onClickEdit}
                                             handleAddLocations={onClickAddLocations} isMobile={isMobile}
                                             onClickEditLocation={onClickEditLocation} onClickDelete={onClickDelete}
                                             onClickDeleteLocation={onClickDeleteLocation}/>
                                    ))}
                                </>
                            }
                            {routes.length === 0 &&
                                <TableRow>
                                    <TableCell component="th" scope="row" colSpan={"6"} align={"center"}>
                                        <TableEmpty message={"No routes to display"}/>
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
            {!loading && routes.length > 0 &&
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={routes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={() => console.log('page change')}
                    // onRowsPerPageChange={handleChangeRowsPerPage}
                />
            }
        </>
    )
}
export default RouteTable;