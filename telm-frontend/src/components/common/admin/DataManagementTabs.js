import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ForkRightOutlinedIcon from "@mui/icons-material/ForkRightOutlined";
import {Box} from "@mui/material";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import {DescriptionOutlined, DynamicFeedOutlined} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';

const DataManagementTabs = () => {
    const router = useRouter();
    const [tab, setTab] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleTabChange = (event, newValue) => {
        setTab(newValue);

        // Use router.push() to navigate to the desired route
        if (newValue === 0) {
            router.push("/admin/data/services"); // Replace with your actual route
        } else if (newValue === 1) {
            router.push("/admin/data/routes"); // Replace with your actual route
        } else if (newValue === 2) {
            router.push("/admin/data/followup_reasons"); // Replace with your actual route
        } else if (newValue === 3) {
            router.push("/admin/data/job_document_types"); // Replace with your actual route
        } else if (newValue === 4) {
            router.push("/admin/data/lead_stages"); // Replace with your actual route
        } else if (newValue === 5) {
            router.push("/admin/data/lead_sources"); // Replace with your actual route
        }
    };

    // Use useEffect to sync the active tab with the route pathname on component mount
    useEffect(() => {
        // Map route pathnames to tab indices
        const routeToTabIndex = {
            "/admin/data/services": 0,
            "/admin/data/routes": 1,
            "/admin/data/followup_reasons": 2,
            "/admin/data/job_document_types": 3,
            "/admin/data/lead_stages": 4,
            "/admin/data/lead_sources": 5,
        };

        // Get the current route pathname
        const currentPathname = router.pathname;

        // Set the active tab based on the current route
        if (routeToTabIndex.hasOwnProperty(currentPathname)) {
            setTab(routeToTabIndex[currentPathname]);
        }
    }, [router.pathname]);

    return (
        <Box sx={{
            borderBottom: 1,
            borderColor: "divider",
            background: isMobile ? 'linear-gradient(180deg, #f0f0ff, white)' : '#fff'
        }}>
            <Tabs
                variant="scrollable"
                orientation={!isMobile ? "vertical" : "horizontal"}
                scrollButtons="auto"
                sx={{
                    maxWidth: {xs: '100vw', sm: '100%'},
                    minWidth: {xs: '100vw', sm: '16rem'},
                    '& .MuiButtonBase-root': {
                        padding: {
                            xs: '0.56rem 2rem',
                            md: '1rem'
                        },
                        flex: {
                            xs: 'none',
                            md: 1
                        },
                        minHeight: 'auto',
                        textWrap: 'nowrap',
                        justifyContent: {
                            xs: 'center',
                            md: 'flex-start'
                        },
                        borderBottom: {
                            xs: 'none',
                            md: '1px solid #ddd'
                        }
                    }
                }}
                value={tab}
                onChange={handleTabChange}
                aria-label="basic tabs example"
            >
                <Tab iconPosition="start" icon={<ReceiptLongOutlinedIcon/>} label="Services"/>
                <Tab iconPosition="start" icon={<ForkRightOutlinedIcon/>} label="Routes & Locations"/>
                <Tab iconPosition="start" icon={<FactCheckOutlinedIcon/>} label="Follow Up Reasons"/>
                <Tab iconPosition="start" icon={<DescriptionOutlined/>} label="Job Document Types"/>
                <Tab iconPosition="start" icon={<DynamicFeedOutlined/>} label="Lead Stages"/>
                <Tab iconPosition="start" icon={<QuestionAnswerOutlinedIcon/>} label="Lead Sources"/>
            </Tabs>
        </Box>
    );
};

export default DataManagementTabs;