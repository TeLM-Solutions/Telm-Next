import {Card, CardContent, CardHeader} from "@mui/material";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    scales: {
        y: {
            ticks: {
                stepSize: 1,
            },
        }
    },
    height: 100,
    plugins: {
        legend: {
            display: false
        },
    },
};
const dataCounts = [0, 0, 0]

const LeadClassificationChart = ({reports}) => {

    const data = {
        labels: ['Hot', 'Warm', 'Cold'], // Labels for the bars
        datasets: [
            {
                data: [reports?.hot || 0, reports?.warm || 0, reports?.cold || 0], // Data values for each label
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(235, 177, 53, 0.5)',
                    'rgba(53, 162, 235, 0.5)'
                ]
            }
        ]
    }

    return (
        <Card>

            <CardHeader titleTypographyProps={{fontSize: '1rem', fontWeight: 500}}
                        title={"Lead Classifications"}
                        subheaderTypographyProps={{fontSize: '0.8125rem',}}
                        subheader={"Top Classifications Overview"}/>
            <CardContent sx={{height: '100%'}}>

                <Bar options={options} data={data} height={'200px'}/>

            </CardContent>

        </Card>
    )
}
export default LeadClassificationChart;