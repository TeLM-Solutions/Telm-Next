import {ArcElement, Chart as ChartJS, Colors, Tooltip,} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import {useState} from "react";
import {Box} from "@mui/material";

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
            display: true,
        },
    },
};


const LocationsBarChart = ({reports}) => {


    const chartData = {
        labels: reports?.map((item) => item.name),
        datasets: [
            {
                data: reports?.map((item) => item.count),
                borderWidth: 2,
                fill: false,
            },
        ],
    };
    const [tab, setTab] = useState(0);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Box>
            <Pie options={options} data={chartData}/>
        </Box>
    )
}
export default LocationsBarChart;