import {CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip} from 'chart.js';
import {Line} from 'react-chartjs-2';
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
        y: {
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
const dataCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const LeadsChart = ({dataSet}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const data = {
        labels,
        datasets: [
            {
                label: 'Created',
                data: dataSet?.leads || dataCounts,
                borderColor: 'rgb(99,112,255)',
                backgroundColor: 'rgba(99,112,255, 0.5)',
            },
            {
                label: 'Closed',

                data: dataSet?.jobs || dataCounts,
                borderColor: 'rgb(30,164,88)',
                backgroundColor: 'rgba(30,164,88, 0.5)',
            },

        ],
    };

    return (
        <Line options={options} data={data} height={isMobile ? '200px' : '50px'}/>
    )

}
export default LeadsChart