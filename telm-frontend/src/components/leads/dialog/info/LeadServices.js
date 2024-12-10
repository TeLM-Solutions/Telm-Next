import {Box, Chip, Divider, IconButton, Stack, Typography} from "@mui/material";
import ColorBox from "@/components/common/ColorBox";
import CurrencyFormatter from "@/lib/currencyFormatter";
import {StyledPaper} from '../../../../styles/styles';
import {useAuth} from "@/hooks/auth";
import TrendingFlatOutlinedIcon from '@mui/icons-material/TrendingFlatOutlined';
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {CheckCircle, EditNote} from "@mui/icons-material";
import {useState} from "react";
import LeadServiceEditDialog from "@/components/leads/dialog/info/LeadServiceEditDialog";

const LeadServices = ({services, onUpdateService}) => {

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editService, setEditService] = useState({});

    const {user} = useAuth({middleware: 'auth'})

    const handleClickEdit = (id) => {
        const service = services.find(service => service.id === id);
        setEditService(service)
        setShowEditDialog(true);
    }
    const handleCloseEdi = () => {
        setEditService({})
        setShowEditDialog(false);
        onUpdateService();
    }

    const totalServicePrice =
        services
            ? services.reduce((total, service) => total + parseFloat(service.price), 0)
            : 0;
    return (
        <Box sx={StyledPaper}>
            <Box className={"heading"}>
                <Typography>Services</Typography>
            </Box>
            <Divider/>
            <Box className={"services no-padd"}>

                <TableContainer>
                    <Table size={"small"} aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{borderBottom: '1px solid #ddd'}}>
                                <TableCell>Service</TableCell>
                                {user.role !== 'executive' &&
                                    <>
                                        <TableCell>Price Range</TableCell>
                                        <TableCell>Incentive</TableCell>

                                    </>
                                }

                                <TableCell align={"right"}>Status</TableCell>
                                {user.role !== 'executive' &&
                                    <TableCell align={"right"}></TableCell>
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {services.map((service, index) =>
                                <TableRow
                                    key={service.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell>
                                        <Stack direction={"row"} gap={"1rem"} alignItems={"center"}
                                               padding={"1rem 0"}>
                                            <ColorBox text={service.name} large={true}/>
                                            <Typography className={"service-name"}>
                                                {service.name}
                                            </Typography>
                                        </Stack>
                                    </TableCell>

                                    {user.role !== 'executive' && (
                                        <>
                                            <TableCell>
                                                <Stack direction={"row"} gap={"1rem"}>
                                                    {service.pivot.price_from &&
                                                        <>
                                                            <Typography>
                                                                <CurrencyFormatter amount={service.pivot.price_from}/>
                                                            </Typography>
                                                            <TrendingFlatOutlinedIcon color={"disabled"}/>
                                                        </>
                                                    }
                                                    {service.pivot.price_to &&
                                                        <Typography>
                                                            <CurrencyFormatter amount={service.pivot.price_to}/>
                                                        </Typography>
                                                    }
                                                    {!service.pivot.price_from && !service.pivot.price_to &&
                                                        <Chip label={"Not Provided"} color={"error"}
                                                              variant={"outlined"}/>
                                                    }
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                {service.pivot.incentive_amount &&
                                                    <>
                                                        {service.pivot.incentive_type === 'cash' &&
                                                            <Typography>
                                                                <CurrencyFormatter
                                                                    amount={service.pivot.incentive_amount}/>
                                                            </Typography>
                                                        }
                                                        {service.pivot.incentive_type !== 'cash' &&
                                                            <Typography className={"service-name"}>
                                                                {service.pivot.incentive_amount}%
                                                            </Typography>
                                                        }
                                                    </>
                                                }
                                            </TableCell>

                                        </>
                                    )}
                                    <TableCell align={"right"}>
                                        {service.pivot.status == 1 &&
                                            <Chip color={"secondary"}
                                                  sx={{paddingLeft: '0.5rem', height: '1.75rem'}}
                                                  icon={<RadioButtonUncheckedIcon fontSize={"tiny"}/>}
                                                  label="Open"
                                                  variant={"outlined"}/>
                                        }
                                        {service.pivot.status == 0 &&
                                            <Chip color={"error"}
                                                  sx={{paddingLeft: '0.5rem', height: '1.75rem'}}
                                                  icon={<CheckCircle fontSize={"tiny"}/>}
                                                  label="Closed"
                                                  variant={"outlined"}/>
                                        }
                                    </TableCell>
                                    {user.role === 'manager' && (
                                        <TableCell align={"right"}>
                                            <IconButton color="gra" aria-label="view"
                                                        onClick={() => handleClickEdit(service.id)}>
                                                <EditNote/>
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>


            </Box>
            {user.role === 'manager' &&
                <LeadServiceEditDialog isDialogOpen={showEditDialog} service={editService}
                                       handleDialogClose={handleCloseEdi}/>
            }


        </Box>
    )
}

export default LeadServices;