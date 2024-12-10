import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import AdjustIcon from "@mui/icons-material/Adjust";
import {Chip} from "@mui/material";

const LeadUrgency = ({urgency}) => {
    return (
        <Chip icon={urgency == 1 ? <CrisisAlertIcon/> : <AdjustIcon/>}
              variant="outlined"
              sx={{fontWeight: 'bold', borderWidth: '2px'}}
              color={urgency == 1 ? 'warning' : 'default'}
              label={urgency == 1 ? 'High' : 'Low'}/>
    )
}
export default LeadUrgency;