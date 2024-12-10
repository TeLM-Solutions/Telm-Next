import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {useEffect, useState} from "react";
import {dispatch, useSelector} from "@/store";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {fetchAManager, resetManagerState} from "@/store/slices/managerSlice";
import ManagerViewHead from "@/components/managers/dialog/ManagerViewHead";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import {FactCheckOutlined} from "@mui/icons-material";
import {Alert, Box, Divider, Stack, Typography} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BranchDialogInfo from "@/components/branches/dialog/BranchDialogInfo";
import {StyledPaper} from "@/styles/styles";
import ManagerViewInfo from "@/components/managers/dialog/MangerViewInfo";
import BranchDialogLeads from "@/components/branches/dialog/BranchDialogLeads";
import LeadBusinessShortShimmer from "@/components/shimmers/LeadBusinessShortShimmer";
import useMediaQuery from "@mui/material/useMediaQuery";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root:not(.MuiCard-root)': {
        maxWidth: 'fit-content'
    },
}));
const ManagerViewDialog = ({id, isDialogOpen, handleDialogClose}) => {

    const [isLoading, setIsLoading] = useState(true)
    const {manager} = useSelector((state) => state.managers);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [tab, setTab] = useState(0);

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    useEffect(() => {
        if (isDialogOpen) {
            fetchBranch();
        }
    }, [isDialogOpen])

    const handleClose = () => {
        dispatch(resetManagerState())
        handleDialogClose();
        setIsLoading(true)
        setTab(0)
    }

    const fetchBranch = async () => {
        await dispatch(fetchAManager(id));
        setIsLoading(false)
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
            scroll={"body"}
            fullScreen={isMobile}
        >
            <ManagerViewHead name={manager?.name} isLoading={isLoading}/>

            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon/>
            </IconButton>
            <DialogContent dividers sx={{padding: 0, width: isMobile ? '100vw' : '60vw'}} className={"has-gradient-bg"}>

                <Box sx={{background: '#fff'}}>
                    <Tabs
                        value={tab}
                        textColor="secondary"
                        indicatorColor="secondary"
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiButtonBase-root': {
                                padding: '0.56rem 0',
                                flex: '1',
                                minHeight: 'auto',
                                maxWidth: 'inherti'
                            }
                        }}
                        aria-label="icon position tabs example"
                    >
                        <Tab icon={<TextSnippetOutlinedIcon/>} iconPosition="start" label="Info"/>
                        {!isLoading && manager && manager.managed_branch !== null &&
                            <Tab icon={<FactCheckOutlined/>} iconPosition="start" label="Branch Leads"/>
                        }
                    </Tabs>
                </Box>

                <Divider/>

                <Stack p={{xs: "1rem 0.5rem 3rem", md: "1.5rem"}} gap={"1.5rem"} direction={"column"}>

                    {manager !== null && !isLoading &&

                        <>
                            {tab === 0 &&
                                <>
                                    <ManagerViewInfo manager={manager}/>
                                    {manager.managed_branch === null &&
                                        <Box sx={StyledPaper}>
                                            <Box className={"heading has-button"}>
                                                <Typography>Branch Info</Typography>
                                            </Box>
                                            <Divider/>
                                            <Box className={"services"}>
                                                <Alert severity="error">Not assigned</Alert>
                                            </Box>
                                        </Box>
                                    }
                                    {manager.managed_branch !== null &&
                                        <BranchDialogInfo showBranch={true} showManger={false}
                                                          branch={manager.managed_branch}/>
                                    }
                                </>
                            }
                            {tab === 1 &&
                                <>
                                    <BranchDialogLeads leads={manager.managed_branch.leads}/>
                                </>
                            }
                        </>
                    }
                    {isLoading &&
                        <>
                            <LeadBusinessShortShimmer title={"Manager Info"}/>
                            <LeadBusinessShortShimmer title={"Branch Info"}/>
                        </>
                    }

                </Stack>

            </DialogContent>
        </BootstrapDialog>
    )

}
export default ManagerViewDialog;