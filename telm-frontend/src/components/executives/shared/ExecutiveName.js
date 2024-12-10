import UserAvatar from "@/components/common/UserAvatar";
import {Stack, Typography} from "@mui/material";

const ExecutiveName = ({onClickView, name, email, id}) => {
    return (
        <Stack direction="row"
               alignItems="center"
               onClick={() => onClickView(id)}
               sx={{gap: '0.5rem', cursor: 'pointer'}}>
            <UserAvatar name={name}/>
            <Stack>
                <Typography varient={"body2"}
                            sx={{fontSize: '0.875rem'}}>{name}</Typography>
                <Typography varient={"body2"}
                            sx={{fontSize: '0.75rem'}}>{email}</Typography>
            </Stack>
        </Stack>
    )
}
export default ExecutiveName;