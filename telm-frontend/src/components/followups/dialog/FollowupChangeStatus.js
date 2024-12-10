import {Button, Stack} from "@mui/material";

const FollowupChangeStatus = ({handleStatusChange, isLoading}) => {
    return (
        <>
            <Stack

                direction={{
                    xs: 'column',
                    md: 'row'
                }} gap={{
                xs: '1rem',
                md: '1rem'
            }}>
                <Button onClick={() => handleStatusChange(2)} color={"primary"}
                        variant={"outlined"}
                        disabled={isLoading}
                        sx={{width: 'fit-content'}}>Mark as Completed</Button>
                <Button onClick={() => handleStatusChange(0)} color={"error"}
                        variant={"outlined"}
                        disabled={isLoading}

                        sx={{width: 'fit-content'}}>Mark as Not Interested</Button>
                <Button onClick={() => handleStatusChange(3)} color={"warning"}
                        variant={"outlined"}
                        disabled={isLoading}
                        sx={{width: 'fit-content'}}>Mark as Rescheduled</Button>
            </Stack>
        </>
    )
}
export default FollowupChangeStatus;