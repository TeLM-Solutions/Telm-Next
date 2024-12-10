import {Card, CardContent, Typography} from "@mui/material";

const HeaderCountCard = ({type, heading, count = 0}) => {

    let backgroundColor = 'linear-gradient(7deg, #f3f6ff, transparent)';
    let borderColor = '#c3d3ff';
    let textColor = '#344986';

    if (type === 'jobs_opened') {
        backgroundColor = 'linear-gradient(7deg, #dbf0ff, transparent)';
        borderColor = '#c1d1ff';
        textColor = '#2c607e';
    }
    if (type === 'jobs_closed') {
        backgroundColor = 'linear-gradient(7deg, #e7fffc, transparent)';
        borderColor = '#c2dbc9';
        textColor = '#1f6858';
    }

    return (
        <Card sx={{
            minWidth: {
                xs: 'fit-content',
                md: 240
            },
            background: backgroundColor,
            border: `1px solid ${borderColor}`
        }}>
            <CardContent sx={{padding: '0.5rem 1rem !important'}}>
                <Typography
                    sx={{
                        fontSize: '1rem',
                        letterSpacing: '0.01563rem',
                        fontWeight: 500,
                        color: textColor,
                    }}
                    component="h1">
                    {heading}
                </Typography>
                <Typography
                    sx={{
                        fontSize: '2rem',
                        lineHeight: '3rem',
                        letterSpacing: '0.01563rem',
                        fontWeight: 600,
                        color: textColor

                    }}
                    component="h1">
                    {count}
                </Typography>
            </CardContent>

        </Card>
    )
}
export default HeaderCountCard;