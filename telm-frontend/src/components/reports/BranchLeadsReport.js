import {Card, CardContent, CardHeader} from "@mui/material";
import BranchLeadsChart from "@/components/reports/charts/BranchLeadsChart";

const BranchLeadsReport = ({reports}) => {

    return (
        <Card sx={{flex: 1}}>

            <CardHeader titleTypographyProps={{fontSize: '1rem', fontWeight: 500}}
                        title={"Branches"}
                        subheaderTypographyProps={{fontSize: '0.8125rem',}}
                        subheader={"Branch based lead creation overview"}/>
            <CardContent sx={{height: '100%', minHeight: 300}}>
                {reports &&
                    <BranchLeadsChart dataSet={reports}/>
                }
            </CardContent>

        </Card>
    )
}
export default BranchLeadsReport;