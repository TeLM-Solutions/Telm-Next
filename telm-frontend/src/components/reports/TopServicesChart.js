import {Card, CardContent, CardHeader} from "@mui/material";
import {ArcElement, Chart as ChartJS, Colors, Tooltip} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

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

const TopServicesChart = ({reports}) => {

    const chartData = {
        labels: reports?.map((item) => item.name),
        datasets: [
            {
                data: reports?.map((item) => item.count),
                borderWidth: 3,
                fill: false,
            },
        ],
    };


    return (
        <Card sx={{
            width: {
                xs: '100%',
                md: '20vw'
            }
        }}>

            <CardHeader titleTypographyProps={{fontSize: '1rem', fontWeight: 500}}
                        title={"Top Services"}
                        subheaderTypographyProps={{fontSize: '0.8125rem',}}
                        subheader={"Most used services"}/>
            <CardContent>

                <Doughnut options={options} data={chartData} height={"300px"}/>

            </CardContent>

        </Card>
    )
}
export default TopServicesChart;