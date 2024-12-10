import {useState} from "react";
import {Box, Stack, Tab, Tabs} from "@mui/material";
import BusinessLeadsChart from "@/components/reports/charts/BusinessLeadsChart";
import BusinessServicesChart from "@/components/reports/charts/BusinessServicesChart";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <Box flex={1}
             role="tabpanel"
             hidden={value !== index}
             id={`vertical-business-tab-${index}`}
             aria-labelledby={`vertical-business-tab-${index}`}
             {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </Box>
    );
}

const BusinessTabCharts = ({leads, services}) => {

    const [tab, setTab] = useState(0);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Stack>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs
                    centered={true}
                    value={tab}
                    onChange={handleChange}
                    aria-label="Business tabs"
                >
                    <Tab label={"Leads"}/>
                    <Tab label={"Services"}/>
                </Tabs>
            </Box>

            <Stack padding={"2rem"}>
                <TabPanel value={tab} index={0}>
                    <BusinessLeadsChart dataSet={leads}/>
                </TabPanel>
                <TabPanel value={tab} index={1}>

                    <BusinessServicesChart reports={services}/>

                </TabPanel>
            </Stack>


        </Stack>
    )

}
export default BusinessTabCharts