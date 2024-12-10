import {
    Box,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Chip,
    Collapse,
    Divider,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import Icon from "@/components/common/Icon";
import EditIcon from "../../../../public/images/icons/edit.svg";
import {useAuth} from "@/hooks/auth";
import CountDownDays from "@/components/common/CountDownDays";
import FollowUpStatusChipSmall from "@/components/followups/shared/FollowUpStatusChipSmall";
import {styled} from "@mui/material/styles";
import {useState} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import JobStartEndDateProgress from "@/components/jobs/shared/JobStartEndDateProgress";
import LeadStatusChip from "@/components/leads/shared/LeadStatusChip";
import LeadUrgencyChip from "@/components/leads/shared/LeadUrgencyChip";
import LeadTableServices from "@/components/leads/LeadTableServices";
import TableEmpty from "@/components/common/TableEmpty";
import MobilePagination from "@/components/common/MobilePagination";
import FollowupContactType from "@/components/followups/shared/FollowupContactType";

const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    marginLeft: 'auto',
    '& svg': {
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    }
}));

const MobileFollowUpTable = ({loading, followups, onClickEdit, onViewClick, pagination, onTablePageChange}) => {

    const [expandedCardId, setExpandedCardId] = useState(null);

    const {user} = useAuth({middleware: 'auth'})

    const handleExpandClick = (rowId) => {
        if (expandedCardId === rowId) {
            setExpandedCardId(null);
        } else {
            setExpandedCardId(rowId);
        }
    };

    const rowsPerPage = 10;
    const page = 0;

    return (
        <Stack gap={"1rem"} padding={"1rem"}>
            {followups.length > 0 &&
                <>
                    {followups.map((row) => {

                        const isCardExpanded = expandedCardId === row.id;
                        return (
                            <Card
                                key={row.id}
                            >
                                <CardActionArea onClick={() => onViewClick(row.id)}>
                                    <CardContent sx={{padding: '0 !important'}}>
                                        <Stack direction={"column"}>

                                            <Stack direction={"row"} alignItems={"center"}
                                                   justifyContent={"space-between"}
                                                   padding={"1rem 1rem 0.5rem"}>

                                                <Stack>
                                                    <BusinessNameBlock name={row.lead.business.name}
                                                                       location={row.lead.business.location.name}/>
                                                </Stack>

                                                {user.role === 'executive' && row.status == 1 &&
                                                    <Stack direction={"row"} alignItems={"center"}>
                                                        <IconButton aria-label="view" size="large"
                                                                    onClick={event => {
                                                                        event.stopPropagation();
                                                                        event.preventDefault();
                                                                        onClickEdit(row.id)
                                                                    }}>
                                                            <Icon src={EditIcon} height={20} width={21}/>
                                                        </IconButton>
                                                        {/*<IconButton aria-label="delete" size="large">*/}
                                                        {/*    <Icon src={DeleteIcon} height={20} width={20}/>*/}
                                                        {/*</IconButton>*/}
                                                    </Stack>
                                                }
                                            </Stack>

                                            <Divider/>
                                            <Stack padding={"1rem"} gap={"1rem"}
                                                   sx={{background: '#fffbed'}}>
                                                <Box sx={{}}>

                                                    <Typography sx={{
                                                        color: 'rgba(41, 41, 41, 0.87)',
                                                        fontSize: '0.9375rem',
                                                        lineHeight: '1.34063rem',
                                                        letterSpacing: '0.01063rem',
                                                        fontWeight: 500
                                                    }}>
                                                        {row.followups[0].reason.title}
                                                    </Typography>

                                                </Box>
                                            </Stack>

                                            <Divider/>

                                            <Stack padding={"1rem"} direction={"column"}
                                                   justifyContent={"space-between"} gap={"1rem"}>

                                                <Stack direction={"row"}
                                                       justifyContent={"space-between"}>
                                                    <Stack gap={"1rem"}>
                                                        Total Followups
                                                        <Chip variant={"outlined"} sx={{width: 'fit-content'}}
                                                              label={row.followups.length}/>
                                                    </Stack>
                                                    <Stack gap={"1rem"}>
                                                        Last followup status
                                                        <FollowUpStatusChipSmall status={row.followups[0].status}
                                                                                 hideStatusText={true}/>
                                                    </Stack>
                                                </Stack>
                                                <Stack gap={"1rem"}>
                                                    Last followup contact date
                                                    <CountDownDays jobStatus={row.status} vertical={true}
                                                                   followUpStatus={row.followups[0].status}
                                                                   targetDate={row.followups[0].date}
                                                                   targetTime={row.followups[0].time}/>
                                                </Stack>

                                            </Stack>

                                            <Divider/>


                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions disableSpacing>

                                    {row.followups[0].contact_type &&
                                        <FollowupContactType type={row.followups[0].contact_type} isSmall={true}/>
                                    }
                                    <ExpandMore
                                        expand={isCardExpanded}
                                        onClick={() => handleExpandClick(row.id)} // Pass row.id to handleExpandClick
                                        aria-expanded={isCardExpanded}
                                        aria-label="show more"
                                    >
                                        <Typography sx={{fontSize: '0.875rem', fontWeight: 'bold'}}>
                                            {isCardExpanded ? 'Less Info' : 'More Info'}
                                        </Typography>
                                        <ExpandMoreIcon/>
                                    </ExpandMore>
                                </CardActions>
                                <Collapse in={isCardExpanded} timeout="auto" unmountOnExit>
                                    <Divider/>
                                    <CardContent sx={{background: 'linear-gradient(193deg, #efefef, transparent)'}}>
                                        <CardActionArea onClick={() => onViewClick(row.id)}>
                                            <Stack gap={"1rem"}
                                                   sx={{background: '#fff', boxShadow: '0 0 10px #0000001c'}}
                                                   padding={"1rem"}>

                                                <Stack>
                                                    <Typography sx={{fontSize: '0.875rem', fontWeight: 'bold'}}
                                                                paragraph>Services</Typography>
                                                    <LeadTableServices isRow={true} services={row.lead.services}/>
                                                </Stack>
                                                <Divider/>

                                                <Stack>
                                                    <Typography sx={{fontSize: '0.875rem', fontWeight: 'bold'}}
                                                                paragraph>Job
                                                        Start
                                                        & End Date</Typography>
                                                    <JobStartEndDateProgress job_status={row.status}
                                                                             end_date={row.end_date}
                                                                             start_date={row.start_date}/>
                                                </Stack>

                                                <Divider/>


                                                <Stack direction={"row"} alignItems={"center"}
                                                       justifyContent={"space-between"}>
                                                    <LeadStatusChip text={"Job Status"} status={row.status}/>
                                                    <LeadUrgencyChip urgency={row.lead.urgency}/>
                                                </Stack>

                                            </Stack>
                                        </CardActionArea>

                                    </CardContent>
                                </Collapse>
                            </Card>
                        )
                    })}
                </>
            }

            {
                !loading && followups.length === 0 &&
                <TableEmpty message={"No follow ups to display"}/>
            }
            {
                pagination &&

                <MobilePagination onPageChange={onTablePageChange} currentPage={pagination.current_page - 1}
                                  lastPage={pagination.last_page - 1}/>

            }
        </Stack>
    )

}
export default MobileFollowUpTable;