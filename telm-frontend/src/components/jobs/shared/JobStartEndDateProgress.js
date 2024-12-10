import {Chip, Stack} from "@mui/material";
import {dateFormat} from "@/lib/relativeTime";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import DateProgressBar from "@/components/common/DateProgressBar";

const dateChipsStyle = {
    borderRadius: '0.2rem',
    fontSize: '0.75rem',
    height: '1.45rem',
    fontWeight: 600,
    width: 96,
    border: 'none',
    justifyContent: 'start',
    '& span': {
        padding: '0'
    }
};
const JobStartEndDateProgress = ({start_date, end_date, job_status = null}) => {
    return (
        <Stack direction={"column"} gap={"1rem"} sx={{
            maxWidth: {
                xs: '100%',
                md: '12rem',
                lg: '15rem'
            }
        }}>
            <Stack direction={"row"} alignItems={"center"}
                   justifyContent={"space-between"}>
                <Chip variant={"outlined"} sx={dateChipsStyle}
                      label={dateFormat(start_date, false, true)}/>
                <TrendingFlatIcon sx={{color: '#a1a1a1'}}/>
                <Chip variant={"outlined"}
                      sx={{
                          ...dateChipsStyle,
                          justifyContent: 'flex-end',
                      }}
                      label={dateFormat(end_date, false, true)}/>
            </Stack>
            <DateProgressBar status={job_status} startDate={start_date} endDate={end_date}/>
        </Stack>
    )
}
export default JobStartEndDateProgress;