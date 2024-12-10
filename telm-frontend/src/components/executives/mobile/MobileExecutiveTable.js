import {Card, CardActionArea, CardContent, Chip, Divider, IconButton, Stack, Typography} from "@mui/material";
import ExecutiveName from "@/components/executives/shared/ExecutiveName";
import {CallOutlined} from "@mui/icons-material";
import JobClosed from "@/components/executives/shared/JobClosed";
import MobilePagination from "@/components/common/MobilePagination";
import Icon from "@/components/common/Icon";
import EditIcon from "../../../../public/images/icons/edit.svg";
import DeleteIcon from "../../../../public/images/icons/delete.svg";
import React from "react";
import TableEmpty from "@/components/common/TableEmpty";

const MobileExecutiveTable = ({
                                  loading,
                                  executives,
                                  onClickEdit,
                                  onClickView,
                                  pagination,
                                  onTablePageChange,
                                  onClickDelete
                              }) => {
    const rowsPerPage = 10;
    const page = 0;

    return (
        <Stack gap={"1rem"} padding={"1rem"}>
            {executives.length > 0 &&
                <>
                    {executives.map((row) => {

                        return (
                            <Card
                                key={row.id}
                            >
                                <CardActionArea onClick={() => onClickView(row.id)}>

                                    <CardContent sx={{padding: '0 !important'}}>
                                        <Stack direction={"column"} gap={"0.5rem"}>
                                            <Stack padding={"1rem 1rem 0.5rem"} direction={"row"} alignItems={"center"}
                                                   justifyContent={"space-between"}>
                                                <ExecutiveName onClickView={onClickView} name={row.name}
                                                               email={row.email} id={row.id}/>

                                                <Stack direction="row"
                                                       alignItems="center"
                                                       justifyContent="flex-end"
                                                       sx={{gap: '0.5rem'}}>

                                                    <IconButton aria-label="view" size="large"
                                                                onClick={event => {
                                                                    event.stopPropagation();
                                                                    event.preventDefault();
                                                                    onClickEdit(row.id)
                                                                }}>
                                                        <Icon src={EditIcon} height={20} width={21}/>
                                                    </IconButton>
                                                    {row.total_leads == 0 && row.total_jobs == 0 &&
                                                        <IconButton aria-label="delete" size="large"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        e.preventDefault();
                                                                        onClickDelete(row.id)
                                                                    }}>
                                                            <Icon src={DeleteIcon} height={20} width={20}/>
                                                        </IconButton>
                                                    }
                                                </Stack>
                                            </Stack>
                                            <Divider/>
                                            <Stack direction={"row"} justifyContent={"space-between"}>
                                                <Stack direction={"row"} gap={"0.5rem"} padding={"1rem 1rem 0.5rem"}
                                                       alignItems={"center"}>
                                                    <CallOutlined fontSize={"tiny"}/>
                                                    <Typography sx={{fontWeight: 500}}
                                                                varient={"body2"}>{row.contact_number}</Typography>
                                                </Stack>
                                                <Stack direction={"row"} gap={"0.5rem"} padding={"1rem"}
                                                       alignItems={"center"}>
                                                    <Typography sx={{fontWeight: 500, fontSize: '0.875rem'}}
                                                                color="text.secondary"
                                                                variant="caption">Total Leads</Typography>
                                                    <Chip label={row.total_leads}/>
                                                </Stack>
                                            </Stack>

                                            {parseInt(row.total_jobs, 10) > 0 &&
                                                <>
                                                    <Divider/>

                                                    <Stack direction={"column"} gap={"0.5rem"}
                                                           padding={"0.5rem 1rem 1rem"}>
                                                        <Typography sx={{fontWeight: 500, fontSize: '0.875rem'}}
                                                                    color="text.secondary"
                                                                    variant="caption">Jobs</Typography>
                                                        <JobClosed total_jobs={row.total_jobs}
                                                                   jobs_closed={row.jobs_closed}/>
                                                    </Stack>
                                                </>
                                            }

                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )
                    })}
                    {pagination &&

                        <MobilePagination onPageChange={onTablePageChange} currentPage={pagination.current_page - 1}
                                          lastPage={pagination.last_page - 1}/>

                    }


                </>
            }

            {!loading && executives.length === 0 &&
                <TableEmpty message={"No executives to display"}/>
            }
        </Stack>

    )
}
export default MobileExecutiveTable;