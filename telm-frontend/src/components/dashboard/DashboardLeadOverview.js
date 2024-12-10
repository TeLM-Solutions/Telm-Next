import DashboardTableHead from "@/components/dashboard/DashboardTableHead";
import {Box, Card, Divider} from "@mui/material";
import {CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip,} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
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


const DashboardLeadOverview = ({leads}) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const data = {
        labels,
        datasets: [
            {
                data: leads,
                borderColor: 'rgb(99,112,255)',
                backgroundColor: 'rgba(21,13,66,0.5)',
            },

        ],
    };
    return (
        <Card sx={{flex: 1}}>

            <DashboardTableHead
                title={"Yearly Lead Overview"}
                subText={"All leads created in year 2023"}
                showButton={false}
            />

            <Divider/>
            <Box sx={{
                padding: {
                    xs: '1rem',
                    md: '2rem'
                }
            }}>
                <Line options={options} data={data} height={isMobile ? '180px' : '100%'}/>
            </Box>

        </Card>
    )
}
export default DashboardLeadOverview;