import React, {useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import ColorBox from "@/components/common/ColorBox";

const ServiceList = ({services, isRow = false}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Stack
            flexWrap={"wrap"}
            direction={isRow ? "row" : "column"}
            gap={"0.5rem"}
            alignItems={"start"}
        >
            {services.slice(0, 2).map((service) => (
                <Stack
                    key={service.id}
                    direction={"row"}
                    alignItems={"center"}
                    gap={"0.5rem"}
                >
                    <ColorBox tiny={true} text={service.name}/>
                    <Typography sx={{fontSize: '0.875rem'}}>
                        {service.name}
                    </Typography>
                </Stack>
            ))}

            {services.length > 2 && (
                <Stack direction={"row"} alignItems={"center"} gap={"0.5rem"}>
                    <Button
                        variant="contained"
                        size={"small"}
                        sx={{
                            background: '#eee',
                            border: '1px solid #D1D1D1',
                            color: 'rgba(115, 115, 115, 0.87)',
                            fontSize: '0.875rem',
                            textTransform: 'none',
                            padding: '0 0.25rem',
                            minWidth: 'auto',
                            '&:hover': {
                                background: '#555',
                                color: 'white',
                                borderColor: '#555'
                            }
                        }}
                        onClick={handleButtonClick}
                    >
                        +{`${services.length - 2}`}
                    </Button>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <Stack
                            direction={"column"}
                            alignItems={"start"}
                            padding={"1rem"}
                            gap={"0.25rem"}
                        >
                            {services.slice(2).map((service) => (
                                <Stack
                                    key={service.id}
                                    direction={"row"}
                                    alignItems={"center"}
                                    gap={"0.5rem"}
                                >
                                    <ColorBox tiny={true} text={service.name}/>
                                    <Typography sx={{fontSize: '0.875rem'}}>
                                        {service.name}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Popover>
                </Stack>
            )}
        </Stack>
    );
};

export default ServiceList;