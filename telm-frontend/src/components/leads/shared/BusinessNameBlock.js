import {Stack, Typography} from "@mui/material";
import UserAvatar from "@/components/common/UserAvatar";
import LeadStatusTiny from "@/components/leads/shared/LeadStatusTiny";

const BusinessNameBlock = ({name, location, large = false, showLeadStatus = false, leadStatus = 0}) => {
    return (
        <Stack sx={{
            cursor: 'pointer',
            '& .MuiAvatar-root': {
                transition: 'font-size 0.2s'
            },
            '&:hover .MuiAvatar-root': {
                fontSize: '1.2rem'
            },
        }} direction={"row"} gap={"0.5rem"} alignItems={"start"}>
            <UserAvatar large={large} name={name} variant={"rounded"}/>
            <Stack>
                <Typography sx={{
                    fontSize: large ? '1.125rem' : '0.875rem',
                    fontWeight: large ? '700' : '500',
                    maxWidth: '260px'
                }}>
                    {name}
                </Typography>
                <Stack direction={"row"} gap={"1rem"}>
                    <Typography sx={{
                        fontSize: large ? '0.875rem' : '0.75rem',

                        color: large ? '#292929' : 'rgba(111, 111, 111, 0.87)'
                    }}>
                        {location}
                    </Typography>
                    {showLeadStatus &&
                        <LeadStatusTiny lead_status={leadStatus}/>
                    }
                </Stack>

            </Stack>
        </Stack>
    )
}
export default BusinessNameBlock;