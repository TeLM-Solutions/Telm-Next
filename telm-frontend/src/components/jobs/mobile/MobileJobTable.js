import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import {Card, CardActionArea, CardContent, Divider, IconButton, Stack} from "@mui/material";
import Icon from "@/components/common/Icon";
import EditIcon from "../../../../public/images/icons/edit.svg";
import LeadTableServices from "@/components/leads/LeadTableServices";
import LeadUrgencyChip from "@/components/leads/shared/LeadUrgencyChip";
import LeadStatusChip from "@/components/leads/shared/LeadStatusChip";
import LeadStatusTiny from "@/components/leads/shared/LeadStatusTiny";
import JobStartEndDateProgress from "@/components/jobs/shared/JobStartEndDateProgress";
import TableEmpty from "@/components/common/TableEmpty";
import MobilePagination from "@/components/common/MobilePagination";

const MobileJobTable = ({loading, jobs, onClickEdit, user, onViewClick, onTablePageChange, pagination}) => {
    const rowsPerPage = 10;
    const page = 0;
    return (
        <Stack gap={"1rem"} padding={"1rem"}>
            {!loading && jobs.length > 0 &&
                <>
                    {jobs.map((row) => {

                        return (
                            <Card
                                key={row.id}
                            >
                                <CardActionArea onClick={() => onViewClick(row.id)}>

                                    <CardContent sx={{padding: '0 !important'}}>
                                        <Stack direction={"column"} gap={"0.5rem"}>
                                            <Stack direction={"row"} alignItems={"center"}
                                                   justifyContent={"space-between"}
                                                   padding={"1rem 1rem 0"}>
                                                <Stack>
                                                    <BusinessNameBlock name={row.lead.business.name}
                                                                       location={row.lead.business.location.name}/>
                                                </Stack>

                                                {user.role === 'manager' &&
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
                                            <Stack padding={"0.5rem 1rem 1rem"} gap={"1rem"}>


                                                <LeadTableServices isRow={true} services={row.lead.services}/>
                                                <JobStartEndDateProgress end_date={row.end_date}
                                                                         start_date={row.start_date}
                                                                         job_status={row.status}/>


                                            </Stack>
                                            <Divider/>

                                            <Stack padding={"0.5rem 1rem 1rem"} direction={"row"} alignItems={"center"}
                                                   justifyContent={"space-between"}>


                                                <Stack direction={"row"} alignItems={"center"}
                                                       gap={"0.5rem"}>
                                                    <LeadUrgencyChip urgency={row.lead.urgency}/>
                                                    <LeadStatusChip status={row.lead.status}/>
                                                </Stack>


                                                <LeadStatusTiny lead_status={row.lead.lead_status}/>


                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )
                    })}
                </>
            }
            {!loading && jobs.length === 0 &&
                <TableEmpty message={"No jobs to display"}/>
            }
            {pagination &&

                <MobilePagination onPageChange={onTablePageChange} currentPage={pagination.current_page - 1}
                                  lastPage={pagination.last_page - 1}/>

            }
        </Stack>
    )
}

export default MobileJobTable;