import {Card, CardContent, CardHeader} from "@mui/material";
import LeadsChart from "@/components/reports/charts/LeadsChart";

const LeadJobChart = ({reports}) => {

    return (
        <Card sx={{flex: 1}}>

            <CardHeader titleTypographyProps={{fontSize: '1rem', fontWeight: 500}}
                        title={"Leads Created vs Closed"}
                        subheaderTypographyProps={{fontSize: '0.8125rem',}}
                        subheader={"Yearly Overview"}/>
            <CardContent sx={{height: '100%'}}>
                <LeadsChart dataSet={reports}/>
            </CardContent>

        </Card>
    )
}
export default LeadJobChart;