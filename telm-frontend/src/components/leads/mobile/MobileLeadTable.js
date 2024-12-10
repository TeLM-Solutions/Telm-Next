import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import {Card, CardActionArea, CardContent, Divider, IconButton, Stack} from "@mui/material";
import Icon from "@/components/common/Icon";
import EditIcon from "../../../../public/images/icons/edit.svg";
import LeadUrgencyChip from "@/components/leads/shared/LeadUrgencyChip";
import LeadStatusChip from "@/components/leads/shared/LeadStatusChip";
import LeadTableServices from "@/components/leads/LeadTableServices";
import LeadStatusTiny from "@/components/leads/shared/LeadStatusTiny";
import TableEmpty from "@/components/common/TableEmpty";
import MobilePagination from "@/components/common/MobilePagination";
import React from "react";
import TableExtraButtons from "@/components/leads/shared/TableExtraButtons";

const MobileLeadTable = ({
                             loading,
                             leads,
                             onClickEdit,
                             onClickView,
                             user,
                             onTablePageChange,
                             onClickHold,
                             onClickDelete,
                             pagination
                         }) => {

    const rowsPerPage = 10;
    const page = 0;

    return (
        <Stack gap={"1rem"} padding={"1rem"}>
            {!loading && leads.length > 0 &&
                <>
                    {leads.map((row) => {

                        return (
                            <Card
                                key={row.id}
                            >
                                <CardActionArea onClick={() => onClickView(row.id)}>

                                    <CardContent sx={{padding: '0 !important'}}>
                                        <Stack direction={"column"} gap={"0.5rem"}>
                                            <Stack direction={"row"} alignItems={"center"}
                                                   justifyContent={"space-between"}
                                                   padding={"1rem 1rem 0"}>
                                                <Stack>
                                                    <BusinessNameBlock
                                                        name={row.business.name}
                                                        location={row.business.location.name}
                                                    />
                                                </Stack>

                                                {user.role === 'executive' && row.job_count == 0 &&
                                                    <Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
                                                        <IconButton aria-label="edit" size="large"
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
                                                {user.role === 'manager' && row.job_count == 0 &&
                                                    <>
                                                        {row.user.id == user.id &&
                                                            <IconButton aria-label="edit" size="large"
                                                                        onClick={event => {
                                                                            event.stopPropagation();
                                                                            event.preventDefault();
                                                                            onClickEdit(row.id)
                                                                        }}>
                                                                <Icon src={EditIcon} height={20} width={21}/>
                                                            </IconButton>
                                                        }
                                                        <TableExtraButtons
                                                            onClickDelete={onClickDelete}
                                                            onClickHold={onClickHold}
                                                            leadStatus={row.status}
                                                            canDelete={row.user.id == user.id}
                                                            id={row.id}/>
                                                    </>
                                                }
                                            </Stack>
                                            <Divider/>

                                            <Stack padding={"0.5rem 1rem 1rem"} gap={"1rem"}>


                                                <LeadTableServices isRow={true} services={row.services}/>
                                                <Stack direction={"row"} alignItems={"center"}
                                                       justifyContent={"space-between"}>

                                                    <Stack direction={"row"} alignItems={"center"}
                                                           gap={"0.5rem"}>
                                                        <LeadUrgencyChip urgency={row.urgency}/>
                                                        <LeadStatusChip status={row.status}/>
                                                    </Stack>

                                                    <LeadStatusTiny lead_status={row.lead_status}/>


                                                </Stack>
                                            </Stack>

                                        </Stack>
                                    </CardContent>
                                </CardActionArea>

                            </Card>
                        )
                    })}
                </>
            }
            {!loading && leads.length === 0 &&
                <TableEmpty message={"No leads to display"}/>
            }

            {!loading && pagination &&

                <MobilePagination onPageChange={onTablePageChange} currentPage={pagination.current_page - 1}
                                  lastPage={pagination.last_page - 1}/>

            }
        </Stack>
    )
}
export default MobileLeadTable;