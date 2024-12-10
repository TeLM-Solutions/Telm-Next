import {Box, Typography} from "@mui/material";

const tableCount = ({count, vertical = false}) => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: vertical ? 'row' : 'column',
            gap: vertical ? '0.5rem' : 0
        }}>

            <Box sx={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Box sx={{
                    width: '0.375rem',
                    height: '0.375rem',
                    background: '#2196F3',
                    borderRadius: '0.375rem',
                    display: 'block'
                }}></Box>
                <Typography
                    sx={{
                        display: {
                            xs: 'none',
                            md: 'flex'
                        },
                        color: 'rgba(0, 0, 0, 0.87)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.01563rem'
                    }}
                    component="h1">
                    Total
                </Typography>
            </Box>

            <Typography
                sx={{
                    color: '#3D3D3D',
                    fontSize: '0.75rem',
                    letterSpacing: '0.01563rem',
                    fontWeight: 600
                }}
                component="h1">
                {count}
            </Typography>
        </Box>
    )
}
export default tableCount;