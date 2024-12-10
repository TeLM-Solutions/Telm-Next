import DefaultLayout from "../../components/layouts/DefaultLayout";
import {useEffect} from "react";
import ReportsHeaderCounts from "@/components/reports/HeaderCounts";
import {Stack} from "@mui/material";
import LeadJobChart from "@/components/reports/LeadJobChart";
import {useDispatch, useSelector} from "@/store";
import {fetchLeadJobReports} from "@/store/slices/reportSlice";
import LeadClassificationChart from "@/components/reports/LeadClassificationChart";
import TopServicesChart from "@/components/reports/TopServicesChart";
import TopBusinessChart from "@/components/reports/TopBusinessChart";
import TopRoutesChart from "@/components/reports/TopRoutesChart";
import TopLocationsChart from "@/components/reports/TopLocationsChart";

const Reports = () => {
    const dispatch = useDispatch();
    const {loading, reports} = useSelector((state) => state.reports);

    useEffect(() => {
        dispatch(fetchLeadJobReports());
    }, [dispatch]);
    return (
        <DefaultLayout padded={false}>

            <ReportsHeaderCounts total={reports.total}/>

            <Stack direction={"column"} gap={"2rem"} sx={{
                padding: {
                    xs: '0 0 4rem',
                    md: '1rem'
                },
                margin: {
                    xs: '2rem 0 0',
                    md: 0
                }
            }}>

                <Stack direction={{
                    xs: 'column',
                    md: 'row'
                }} gap={"2rem"}>
                    <LeadJobChart reports={reports.lead_chart}/>
                    <LeadClassificationChart reports={reports.classifications}/>
                </Stack>

                <Stack direction={{
                    xs: 'column',
                    md: 'row'
                }} gap={"2rem"}>

                    <TopServicesChart reports={reports.services}/>
                    <TopBusinessChart reports={reports.business}/>


                </Stack>

                <Stack direction={{
                    xs: 'column',
                    md: 'row'
                }} gap={"2rem"}>
                    <TopRoutesChart reports={reports.routes}/>
                    <TopLocationsChart reports={reports.routes}/>
                </Stack>


            </Stack>


        </DefaultLayout>
    )
}
export default Reports;