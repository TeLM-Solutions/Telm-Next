import {styled, useTheme} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {useEffect, useState} from "react";
import {dispatch, useSelector} from "@/store";
import {fetchABranch, resetBranchState} from "@/store/slices/branchesSlice";
import DialogContent from "@mui/material/DialogContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import {FactCheckOutlined} from "@mui/icons-material";
import {Box, Divider, Stack} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import BranchDialogHead from "@/components/branches/dialog/BranchDialogHead";
import BranchDialogInfo from "@/components/branches/dialog/BranchDialogInfo";
import BranchDialogExecutives from "@/components/branches/dialog/BranchDialogExecutives";
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
const BranchViewDialog = ({id, isDialogOpen, handleDialogClose}) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [isLoading, setIsLoading] = useState(true)
    const {branch} = useSelector((state) => state.branches);

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
        dispatch(resetBranchState())
        handleDialogClose();
        setIsLoading(true)
        setTab(0)
    }

    const fetchBranch = async () => {
        await dispatch(fetchABranch(id));
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
            <BranchDialogHead name={branch?.name} address={branch?.address} isLoading={isLoading}/>

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
                        <Tab icon={<FactCheckOutlined/>} iconPosition="start" label="Leads"/>
                    </Tabs>
                </Box>

                <Divider/>

                <Stack p={{xs: "1rem 0.5rem 3rem", md: "1.5rem"}} gap={"1.5rem"} direction={"column"}>

                    {branch !== null && !isLoading &&

                        <>
                            {tab === 0 &&
                                <>
                                    <BranchDialogInfo branch={branch}/>
                                    <BranchDialogExecutives executives={branch.users}/>
                                </>
                            }
                            {tab === 1 &&
                                <>
                                    <BranchDialogLeads leads={branch.leads}/>
                                </>
                            }
                        </>

                    }
                    {isLoading &&
                        <>
                            <LeadBusinessShortShimmer title={"Branch Info"}/>
                            <LeadBusinessShortShimmer title={"Executives"}/>

                        </>
                    }

                </Stack>

            </DialogContent>
        </BootstrapDialog>
    )

}
export default BranchViewDialog;