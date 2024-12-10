import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {useEffect, useState} from "react";
import {dispatch, useSelector} from "@/store";
import DialogContent from "@mui/material/DialogContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import {BallotOutlined, FactCheckOutlined} from "@mui/icons-material";
import {Box, Divider, Stack} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import LeadBusinessShortShimmer from "@/components/shimmers/LeadBusinessShortShimmer";
import {fetchAExecutive, resetExecutiveState} from "@/store/slices/executiveSlice";
import ManagerViewHead from "@/components/managers/dialog/ManagerViewHead";
import ManagerViewInfo from "@/components/managers/dialog/MangerViewInfo";
import ExecutiveViewDocuments from "@/components/executives/dialog/ExecutiveViewDocuments";
import BranchDialogLeads from "@/components/branches/dialog/BranchDialogLeads";
import ExecutiveViewJobs from "@/components/executives/dialog/ExecutiveViewJobs";
import useMediaQuery from "@mui/material/useMediaQuery";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root:not(.MuiCard-root)': {
        maxWidth: 'fit-content'
    },
}));
const ExecutiveViewDialog = ({id, isDialogOpen, handleDialogClose}) => {

    const [isLoading, setIsLoading] = useState(true)
    const {executive} = useSelector((state) => state.executives);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [tab, setTab] = useState(0);

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    useEffect(() => {
        if (isDialogOpen) {
            fetchExecutive();
        }
    }, [isDialogOpen])

    const handleClose = () => {
        dispatch(resetExecutiveState())
        handleDialogClose();
        setIsLoading(true)
        setTab(0)
    }

    const fetchExecutive = async () => {
        await dispatch(fetchAExecutive(id));
        setIsLoading(false)
    }

    useEffect(() => {
        console.log(executive)
    }, [executive])

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={isDialogOpen}
            fullScreen={isMobile}
            scroll={isMobile ? "paper" : "body"}
        >
            <ManagerViewHead name={executive?.name} isLoading={isLoading}/>
            <Divider/>

            <Box sx={{background: '#fff'}}>
                <Tabs
                    value={tab}
                    textColor="secondary"
                    indicatorColor="secondary"
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
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
                    {executive?.leads.length > 0 &&
                        <Tab icon={<FactCheckOutlined/>} iconPosition="start" label="Leads"/>
                    }
                    {executive?.jobs.length > 0 &&
                        <Tab icon={<BallotOutlined/>} iconPosition="start" label="Jobs"/>
                    }
                </Tabs>
            </Box>

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
            <DialogContent dividers sx={{
                padding: 0, width: {
                    xs: '100vw',
                    md: '60vw'
                }
            }} className={"has-gradient-bg"}>

                <Stack p={{xs: "1rem 0.5rem 3rem", md: "1.5rem"}} gap={"1.5rem"} direction={"column"}>
                    {executive !== null && !isLoading &&
                        <>
                            {tab === 0 &&
                                <>
                                    <Stack direction={{
                                        sx: 'column',
                                        md: 'row'
                                    }} gap={"1rem"}>
                                        <Box flex={1.6}>
                                            <ManagerViewInfo manager={executive} title={"Executive Info"}/>
                                        </Box>
                                        <Box flex={1}>
                                            <ExecutiveViewDocuments
                                                documents={executive.executive_documents}/>

                                        </Box>
                                    </Stack>
                                </>
                            }
                            {tab === 1 &&
                                <>
                                    <BranchDialogLeads leads={executive.leads}/>
                                </>
                            }
                            {tab === 2 &&
                                <>
                                    <ExecutiveViewJobs jobs={executive.jobs}/>
                                </>
                            }
                        </>

                    }
                    {isLoading &&
                        <>
                            <LeadBusinessShortShimmer title={"Executive Info"}/>
                        </>
                    }

                </Stack>

            </DialogContent>
        </BootstrapDialog>
    )

}
export default ExecutiveViewDialog;