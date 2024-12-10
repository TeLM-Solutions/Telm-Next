import {Box, Card, CardContent, CardHeader, Divider, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import ColorBox from "@/components/common/ColorBox";
import BusinessTabCharts from "@/components/reports/charts/BusinessTabCharts";
import TableEmpty from "@/components/common/TableEmpty";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";


function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <Box flex={1}
             role="tabpanel"
             hidden={value !== index}
             id={`vertical-tabpanel-${index}`}
             aria-labelledby={`vertical-tab-${index}`}
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

const TopBusinessChart = ({reports}) => {
    const [tab, setTab] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    useEffect(() => {
        setTab(0)
    }, [reports])

    return (
        <Card sx={{flex: 1}}>


            {reports && reports.length > 0 &&
                <CardContent sx={{p: '0 !important'}}>
                    <Stack direction={{
                        xs: "column",
                        md: "row"
                    }}>
                        <Stack sx={{
                            borderRight: 1,
                            borderColor: 'divider',
                        }}>
                            <CardHeader titleTypographyProps={{fontSize: '1rem', fontWeight: 500}}
                                        title={"Businesses Overview"}
                                        subheaderTypographyProps={{fontSize: '0.8125rem',}}
                                        subheader={"Sorted by top businesses"} sx={{
                                borderBottom: {
                                    xs: '1px solid #ddd',
                                    md: 'none'
                                }
                            }}/>


                            <Box
                                sx={{
                                    flexGrow: 1, display: 'flex', height: {
                                        md: '380px'
                                    },
                                    width: {
                                        xs: '100vw',
                                        md: '100%'
                                    }
                                }}
                            >
                                <Tabs
                                    orientation={isMobile ? "horizontal" : "vertical"}
                                    variant="scrollable"
                                    value={tab}
                                    onChange={handleChange}
                                    aria-label="Vertical tabs example"
                                    sx={{
                                        '& .Mui-selected': {
                                            background: {
                                                xs: 'linear-gradient(-180deg, #d5e6ff -10%, #fff 30%)',
                                                md: 'linear-gradient(270deg, #d5e6ff -10%, #fff 30%)'
                                            },
                                            boxShadow: '0 0 10px #eee'
                                        }
                                    }}

                                >
                                    {reports.map((business, index) => {

                                        const labelText = isMobile ? business.business :
                                            <BusinessNameBlock name={business.business}
                                                               location={business.location}/>

                                        return (
                                            <Tab key={index} label={labelText}
                                                 sx={{alignItems: 'start', '& p': {textAlign: 'left'}}}/>
                                        )

                                    })}
                                </Tabs>

                            </Box>

                        </Stack>

                        {reports.map((business, index) => {

                            return (
                                <TabPanel value={tab} key={index} index={index}>
                                    <Stack
                                        direction={{
                                            xs: "column",
                                            md: "row"
                                        }}
                                        alignItems={{
                                            xs: "start",
                                            md: "center"
                                        }}
                                        padding={'1rem 2rem 1rem 1rem'}
                                        gap={{
                                            xs: "2rem",
                                            md: 0

                                        }}
                                        sx={{
                                            borderTop: {
                                                xs: '1px solid #ddd',
                                                md: 'none'
                                            }
                                        }}

                                        justifyContent={"space-between"}>
                                        <BusinessNameBlock large={true} name={business.business}
                                                           location={business.location}/>

                                        <Stack direction={"row"} alignItems={"center"} gap={"3rem"}>

                                            <Stack alignItems={"end"}>
                                                <Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
                                                    <ColorBox text={"Total Leads"}/>
                                                    <Typography>Total Leads</Typography>
                                                </Stack>
                                                <Typography sx={{
                                                    fontSize: '1.675rem',
                                                    fontWeight: 500
                                                }}>{business.total_leads}</Typography>
                                            </Stack>

                                            <Stack alignItems={"end"}>
                                                <Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
                                                    <ColorBox text={"Red"}/>
                                                    <Typography>Total Services</Typography>
                                                </Stack>
                                                <Typography sx={{
                                                    fontSize: '1.675rem',
                                                    fontWeight: 500
                                                }}>{business.total_services}</Typography>
                                            </Stack>

                                        </Stack>

                                    </Stack>
                                    <Divider/>

                                    <BusinessTabCharts leads={business.lead_chart} services={business.services_chart}/>

                                </TabPanel>
                            )

                        })}


                    </Stack>


                </CardContent>
            }
            {reports && reports.length === 0 &&

                <Stack alignItems={"center"} justifyContent={"center"} sx={{height: '100%'}}>

                    <TableEmpty message={"No business info to display"}/>
                </Stack>

            }
        </Card>
    )
}
export default TopBusinessChart;