import {ArcElement, Chart as ChartJS, Colors, Tooltip} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import {Box, Stack, Typography} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

ChartJS.register(ArcElement, Tooltip, Colors);

const options = {
    responsive: true,
    height: 100,
    plugins: {
        colors: {
            enabled: true,
            forceOverride: true
        },
        legend: {
            display: false
        },
    },
};

const BusinessServicesChart = ({reports}) => {

    const ChartRef = useRef(null);
    const [legends, setLegends] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const chartData = {
        labels: reports?.map((item) => item.name),
        datasets: [
            {
                label: 'Leads ',
                data: reports?.map((item) => item.total),
                borderWidth: 3,
                fill: false,
            },
        ],
    };

    useEffect(() => {
        if (ChartRef) {
            setLegends(ChartRef.current.legend.legendItems)
        }
    }, [ChartRef])


    return (

        <>
            <Stack direction={{
                xs: 'column',
                md: 'row'
            }} gap={"2rem"} justifyContent={"center"}>
                <Box>
                    <Pie ref={ChartRef} options={options} data={chartData}/>
                </Box>
                <Stack gap={"1rem"} justifyContent={"center"}>
                    {legends?.map((item, index) => (
                        <div key={index} style={{display: 'flex', alignItems: 'center', marginRight: '16px'}}>
                            <div
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    marginRight: '8px',
                                    background: item.fillStyle
                                }}
                            ></div>
                            <Typography variant="body2">
                                {item.text}
                            </Typography>
                        </div>
                    ))}
                </Stack>
            </Stack>
        </>


    )
}
export default BusinessServicesChart;