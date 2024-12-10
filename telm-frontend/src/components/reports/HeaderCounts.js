import {Stack} from '@mui/material';
import HeaderCountCard from "@/components/reports/HeaderCountCard";
import {useEffect, useState} from "react";
import {useAuth} from "@/hooks/auth";
import {dispatch, useSelector} from "@/store";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ReportBranchSelect from "@/components/reports/ReportBranchSelect";
import {fetchAllActiveBranches} from "@/store/slices/branchesSlice";

const ReportsHeaderCounts = ({total, onChange}) => {

    // mobile
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {user} = useAuth({middleware: 'auth'})

    const {loading, branches} = useSelector((state) => state.branches);

    const [branch, setBranch] = useState('all');

    const handleChange = (event) => {
        const branch = event.target.value;
        setBranch(branch);
        onChange(branch)
    };

    useEffect(() => {
        dispatch(fetchAllActiveBranches({
            show: true
        }));
    }, [dispatch])

    return (
        <Stack justifyContent={"center"} alignItems={"center"} sx={{
            width: {
                xs: '100vw',
                md: '100%'
            }
        }}>
            {user.role === 'admin' && isMobile &&
                <Stack sx={{padding: '1rem', background: '#fff', width: '100%'}} flex={1}>
                    <ReportBranchSelect branch={branch} branches={branches} handleChange={handleChange}/>
                </Stack>
            }
            <Stack
                direction={{
                    xs: 'column',
                    md: 'row'
                }}
                sx={{
                    width: '100%',
                    background: "#fff",
                    overflow: {
                        xs: 'scroll',
                        md: 'auto'
                    },
                    boxShadow: "5px 1px 7px #ddd, 1px 0px 0px 0px rgba(0, 0, 0, 0.12) inset"
                }}
                alignItems={"center"}
                justifyContent={'space-between'}
            >

                <Stack direction={{
                    xs: 'row',
                }} gap={{
                    xs: '1rem',
                    md: "2rem"
                }} padding={"1rem"} flex={'none'}
                >
                    <HeaderCountCard count={total?.leads} type={"lead"} heading={"Total Leads Created"}/>
                    <HeaderCountCard count={total?.jobs} type={"jobs_opened"} heading={"Total Jobs Opened"}/>
                    <HeaderCountCard count={total?.closed_jobs} type={"jobs_closed"} heading={"Total Jobs Closed"}/>
                </Stack>
                {user.role === 'admin' && !isMobile &&
                    <Stack sx={{minWidth: 240, paddingRight: '1rem'}}>
                        <ReportBranchSelect branch={branch} branches={branches} handleChange={handleChange}/>
                    </Stack>
                }
            </Stack>
        </Stack>
    )
}
export default ReportsHeaderCounts;