import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    Legend
);

const options = {
    responsive: true,
    height: 100,
    scales: {
        y: {
            ticks: {
                stepSize: 1,
            },
        }
    },
    plugins: {
        legend: {
            display: false
        },
    },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dataCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const BusinessLeadsChart = ({dataSet}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dataArray = Object.values(dataSet);

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                data: dataArray || dataCounts,
                borderColor: 'rgb(99,112,255)',
                backgroundColor: 'rgba(99,112,255, 0.2)',
            },
        ],
    };

    return (
        <Line options={options} data={data} height={isMobile ? '230px' : '80px'}/>
    )

}
export default BusinessLeadsChart