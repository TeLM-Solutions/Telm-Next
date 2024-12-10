import {Box, Button, Stack, Typography} from "@mui/material";

const DashboardTableHead = ({title, subText, showButton, onClickButton}) => {
    return (
        <Box
            sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem'}}
        >
            <Stack direction={"column"} gap={"0.5rem"}>
                <Typography
                    sx={{
                        color: 'rgba(0, 0, 0, 0.87)',
                        fontSize: '1rem',
                        lineHeight: '1.235rem',
                        letterSpacing: '0.01563rem',
                        fontWeight: 500
                    }}
                    component="h1">
                    {title}
                </Typography>
                <Typography
                    sx={{
                        color: 'rgba(112, 112, 112, 0.87);',
                        fontSize: '0.8125rem',
                        lineHeight: '1.00344rem',
                        letterSpacing: '0.01563rem'
                    }}
                    component="h1">
                    {subText}
                </Typography>
            </Stack>

            {showButton &&
                <Button variant={"outlined"} color={"secondary"} onClick={onClickButton}>View All</Button>
            }

        </Box>
    )
}
export default DashboardTableHead