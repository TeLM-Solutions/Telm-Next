import DefaultLayout from "../../components/layouts/DefaultLayout";
import {useEffect, useState} from "react";
import ReportsHeaderCounts from "@/components/reports/HeaderCounts";
import {CircularProgress, Stack} from "@mui/material";
import LeadJobChart from "@/components/reports/LeadJobChart";
import {useDispatch, useSelector} from "@/store";
import {fetchLeadJobReports} from "@/store/slices/reportSlice";
import LeadClassificationChart from "@/components/reports/LeadClassificationChart";
import TopServicesChart from "@/components/reports/TopServicesChart";
import TopBusinessChart from "@/components/reports/TopBusinessChart";
import BranchLeadsReport from "@/components/reports/BranchLeadsReport";
import TopRoutesChart from "@/components/reports/TopRoutesChart";
import TopLocationsChart from "@/components/reports/TopLocationsChart";

const Reports = () => {
    const dispatch = useDispatch();
    const {loading, reports} = useSelector((state) => state.reports);
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        dispatch(fetchLeadJobReports());
    }, [dispatch]);

    const handleBranchChanges = async (branch) => {
        const data = {
            branch: branch
        }
        setIsLoading(true)
        setSelectedBranch(branch);
        await dispatch(fetchLeadJobReports(data));
        setIsLoading(false)
    }

    return (
        <DefaultLayout padded={false}>

            <ReportsHeaderCounts total={reports.total} onChange={handleBranchChanges}/>

            <Stack direction={"column"} gap={"2rem"} sx={{
                padding: {
                    xs: '1rem 1rem 4rem',
                    md: '1rem'
                },
                width: {
                    xs: '100vw',
                    md: 'auto'
                },
                position: 'relative'
            }}>
                {isLoading &&
                    <Stack alignItems={"center"} justifyContent={"center"} sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0,
                        background: 'rgba(255,255,255,0.3)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 33
                    }}>
                        <CircularProgress fontSize={"small"}/>
                    </Stack>
                }
                {selectedBranch === 'all' &&
                    <BranchLeadsReport reports={reports.branches}/>
                }

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