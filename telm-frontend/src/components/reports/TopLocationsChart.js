import {Box, Card, CardContent, CardHeader, Stack, Tab, Tabs} from "@mui/material";
import {useEffect, useState} from "react";
import LocationsBarChart from "@/components/reports/charts/LocationsBarChart";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const TopLocationsChart = ({reports}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tab, setTab] = useState(0);
    const [activeReport, setActiveReport] = useState([]); // Set the initial active report

    useEffect(() => {
        if (reports && reports.length) {
            setActiveReport(reports[0].locations)
        } else {
            setActiveReport([])
        }
    }, [reports])
    const handleChange = (event, newValue) => {
        setTab(newValue);
        setActiveReport(reports[newValue].locations);
    };

    return (
        <Card>

            <CardHeader titleTypographyProps={{fontSize: '1rem', fontWeight: 500}}
                        title={"Top Locations"}
                        subheaderTypographyProps={{fontSize: '0.8125rem',}}
                        subheader={"Top Locations Overview"}/>
            <CardContent sx={{height: 400, width: '100%'}}>

                <Stack direction={{
                    xs: "column",
                    md: "row"
                }}>
                    <Box
                        sx={{
                            flexGrow: 1, display: 'flex', height: {
                                md: '380px'
                            },
                            width: {
                                xs: '90vw',
                                md: '180px'
                            }
                        }}
                    >
                        <Tabs
                            orientation={isMobile ? "horizontal" : "vertical"}
                            variant="scrollable"
                            centered={true}
                            value={tab}
                            onChange={handleChange}
                            aria-label="Business tabs"
                        >
                            {reports && reports.map((item, index) => <Tab key={index} label={item.route_name}/>)}

                        </Tabs>
                    </Box>

                    {activeReport &&

                        <Stack>
                            <LocationsBarChart reports={activeReport}/>
                        </Stack>
                    }

                </Stack>
            </CardContent>

        </Card>
    )
}
export default TopLocationsChart;