import CircularProgress, {circularProgressClasses,} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {Box, Stack} from '@mui/material';

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{position: 'relative', display: 'inline-flex', height: 42}}>
            <Box sx={{position: 'relative'}}>
                <CircularProgress
                    variant="determinate"
                    sx={{
                        color: (theme) =>
                            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                    }}
                    size={40}
                    thickness={3}
                    value={100}

                />
                <CircularProgress
                    variant="determinate"
                    disableShrink
                    sx={{
                        color:
                            props.value < 25
                                ? '#ff7979'
                                : props.value < 50
                                    ? '#ff8900'
                                    : props.value < 75
                                        ? '#abbe25'
                                        : '#37bc96',
                        position: 'absolute',
                        left: 0,
                        [`& .${circularProgressClasses.circle}`]: {
                            strokeLinecap: 'round',
                        },
                    }}
                    size={40}
                    thickness={4}
                    {...props}
                />
            </Box>
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary" sx={{fontWeight: 'bold'}}>
                    {props.jobs_closed}/{props.total_jobs}
                </Typography>
            </Box>
        </Box>
    );
}

const JobClosed = ({total_jobs, jobs_closed}) => {
    const percentage = total_jobs === 0 ? 0 : (jobs_closed / total_jobs) * 100;

    return (
        <Stack direction={"row"} gap={"1rem"} alignItem={"center"}>
            <CircularProgressWithLabel value={percentage} total_jobs={total_jobs} jobs_closed={jobs_closed}/>
            <Stack>
                <Typography paragarph={true} sx={{fontSize: '0.875rem', fontWeight: 600}}> {jobs_closed} out
                    of {total_jobs}</Typography>
                <Typography variant="caption" component="div" color="text.secondary">Completed</Typography>
            </Stack>
        </Stack>
    )
}
export default JobClosed;