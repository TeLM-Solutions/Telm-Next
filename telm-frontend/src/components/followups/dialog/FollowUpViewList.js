import {Box, Button, Collapse, Stack} from "@mui/material";
import TableEmpty from "@/components/common/TableEmpty";
import FollowUpViewSingle from "@/components/followups/dialog/FollowUpViewSingle";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {PlaylistAdd} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {useAuth} from "@/hooks/auth";
import FollowupCreateForm from "@/components/followups/shared/FollowupCreateForm";
import {useState} from "react";
import {publish} from "@/lib/events";

const FollowUpViewList = ({
                              followups,
                              emit = false,
                              canCreate = true,
                              job_id,
                              onClickEdit,
                              job_status = null,
                              showTitle = true
                          }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {user} = useAuth({middleware: 'auth'})

    const [showAddFollowup, setShowAddFollowup] = useState(false);

    const handleShowFollowupForm = () => {
        setShowAddFollowup(true)
    }
    const handleCloseFollowupForm = () => {
        setShowAddFollowup(false)
    }

    const onFollowupSuccess = () => {
        publish('followup_status_updated')
        publish('followup_edit_completed')
    }

    return (
        <Stack gap={"2rem"}>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                {showTitle &&
                    <Typography
                        component={"h4"}
                        sx={{
                            fontWeight: 500,
                        }}
                    >Followups</Typography>
                }
                {canCreate && !showAddFollowup &&
                    <Button onClick={() => handleShowFollowupForm()} startIcon={<PlaylistAdd/>} variant={"outlined"}
                            sx={{background: '#fff'}}>Create
                        Followup</Button>
                }
            </Stack>
            <Collapse in={showAddFollowup} unmountOnExit>
                <Box sx={{
                    background: '#fff', padding: 0,
                    boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.25)',
                }}>
                    <FollowupCreateForm onSuccess={onFollowupSuccess} isDialogOpen={showAddFollowup}
                                        handleDialogClose={handleCloseFollowupForm} initialFilterState={{}}
                                        initialData={null} directEmbedData={{
                        job_id: job_id

                    }}/>
                </Box>

            </Collapse>

            {followups.length > 0 &&
                followups
                    .slice()
                    .sort((a, b) => b.id - a.id)
                    .map((followup, index) => (
                        <FollowUpViewSingle key={index} followup={followup} emit={emit} job_status={job_status}
                                            showEdit={canCreate} onClickEdit={onClickEdit}/>
                    ))
            }
            {followups.length === 0 &&
                <TableEmpty message={"No follow ups to display"}/>
            }
        </Stack>
    )
}

export default FollowUpViewList;