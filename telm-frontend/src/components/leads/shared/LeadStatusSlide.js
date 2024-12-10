import {Slider} from "@mui/material";

const LeadStatusSlide = ({lead_status}) => {
    return (
        <Slider
            value={lead_status} // Use the value from the field
            aria-label="Lead Classification"
            min={0}
            sx={{width: 120, cursor: 'unset'}}
            max={2}
            step={1}
            size="small"
            className={
                lead_status === 0
                    ? 'MuiSlider-thumbColorCold'
                    : lead_status === 1
                        ? 'MuiSlider-thumbColorWarm'
                        : 'MuiSlider-thumbColorHot'
            }
            marks={[
                {
                    value: 0,
                    label: 'Cold',
                },
                {
                    value: 1,
                    label: 'Warm',
                },
                {
                    value: 2,
                    label: 'Hot',
                },
            ]}
        />
    )
}
export default LeadStatusSlide;