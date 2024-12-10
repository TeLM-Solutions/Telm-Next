import * as React from 'react';
import {useEffect, useState} from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {timelineOppositeContentClasses,} from '@mui/lab/TimelineOppositeContent';
import {StyledPaper} from "@/styles/styles";
import {Box, Chip, CircularProgress, Stack, Typography} from "@mui/material";
import {useDispatch} from "@/store";
import {fetchLeadStageHistory} from "@/store/slices/leadSlice";
import {dateFormat} from "@/lib/relativeTime";
import UserAvatar from "@/components/common/UserAvatar";

const LeadStageHistory = ({tab, leadId}) => {

    const dispatch = useDispatch();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const fetchData = async () => {
            if (tab) {
                try {
                    const response = await dispatch(fetchLeadStageHistory({leadId}));
                    setHistory(response.payload.history);
                    setIsLoading(false)

                } catch (error) {
                    // Handle any errors that might occur during the dispatch or API call
                    console.error('Error fetching lead stage history:', error);
                }
            }
        };

        fetchData(); // Call the asynchronous function immediately

    }, [dispatch, tab, leadId]);

    const getTitleColor = (title) => {
        switch (title) {
            case 'Deal Closed':
                return 'green'; // Change color to green for 'Deal Closed'
            case 'Lead Lost':
                return 'red'; // Change color to red for 'Lead Lost'
            default:
                return 'primary'; // Use default blue color for other cases
        }
    };

    return (
        <Box sx={{
            ...StyledPaper,
        }}>

            {isLoading &&
                <Stack sx={{padding: '1rem', minHeight: 300, alignItems: 'center', justifyContent: 'center'}}>
                    <CircularProgress size={"1rem"}/>
                </Stack>
            }

            <Timeline
                sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.2,
                    },
                }}
            >
                {history?.map((row, id) => {
                    return (
                        <TimelineItem key={id}>
                            <TimelineOppositeContent color="textSecondary"
                                                     sx={{width: 'fit-content', flex: 'none !important'}}>
                                {dateFormat(row.created_at)}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot variant="outlined"/>
                                <TimelineConnector sx={{backgroundColor: '#ededed'}}/>
                            </TimelineSeparator>
                            <TimelineContent>
                                <Stack gap={"1rem"} sx={{paddingBottom: '2rem'}}>
                                    <Chip label={row.stage.title} variant={"outlined"}
                                          sx={{
                                              fontSize: '1rem',
                                              width: 'fit-content',
                                              color: getTitleColor(row.stage.title),
                                              borderColor: getTitleColor(row.stage.title),
                                          }}/>

                                    <Stack direction="row"
                                           alignItems="center"
                                           sx={{gap: '0.5rem'}}>
                                        <UserAvatar name={row.user.name}/>
                                        <Stack>
                                            <Typography>{row.user.name}</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </TimelineContent>
                        </TimelineItem>
                    )
                })}

            </Timeline>
        </Box>
    )
}

export default LeadStageHistory