import {CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip} from 'chart.js';
import {Line} from "react-chartjs-2";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    height: 100,
    scales: {
        x: {
            beginAtZero: true,
        },
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1,
            },
        }
    },
    plugins: {
        legend: {
            position: 'top'
        },
    },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BranchLeadsChart = ({dataSet}) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const dataTransformed = dataSet.map(item => ({
        ...item,
        leads: Object.values(item.leads),
    }));

    const datasets = dataTransformed.map((item, index) => ({
        label: item.name,
        data: item.leads,
    }));

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: datasets,
    };

    return (
        <Line options={options} data={chartData} height={isMobile ? '200px' : '50px'}/>
    )

}
export default BranchLeadsChart