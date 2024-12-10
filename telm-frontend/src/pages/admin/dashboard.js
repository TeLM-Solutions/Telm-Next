import DefaultLayout from "../../components/layouts/DefaultLayout";
import {Stack} from "@mui/material";
import {useDispatch, useSelector} from "@/store";
import {useEffect} from "react";
import {fetchDashboard} from "@/store/slices/dashboardSlice";
import {useRouter} from "next/router";
import DashboardLeadCard from "@/components/dashboard/DashboardLeadCard";
import DashboardLeadOverview from "@/components/dashboard/DashboardLeadOverview";
import DashboardJobCard from "@/components/dashboard/DashboardJobCard";
import DashboardFollowUpsCard from "@/components/dashboard/DashboardFollowUpsCard";

const Dashboard = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const {loading, dashboard} = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboard());
    }, [dispatch]);
    return (
        <DefaultLayout>
            {!loading &&
                <Stack direction={"column"} gap={"2rem"} sx={{
                    padding: {
                        xs: '0 0 4rem',
                        md: 0
                    }
                }}>
                    <Stack direction={{
                        xs: 'column',
                        md: 'row'
                    }} gap={"2rem"}>
                        <DashboardLeadCard subText={"All leads created recently"} leads={dashboard.leads}/>
                        <DashboardLeadOverview leads={dashboard.chart}/>
                    </Stack>
                    <Stack direction={{
                        xs: 'column',
                        md: 'row'
                    }} gap={"2rem"}>
                        <DashboardJobCard subText={"Jobs created recently"} jobs={dashboard.jobs}/>
                        <DashboardFollowUpsCard followups={dashboard.followups}/>
                    </Stack>
                </Stack>
            }
        </DefaultLayout>
    )
}
export default Dashboard;