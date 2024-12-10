import {Box, Button, Card, CardContent, CardMedia, Chip, Divider, Stack, Typography} from "@mui/material";
import BusinessNameBlock from "@/components/leads/shared/BusinessNameBlock";
import {
    Call,
    EmailSharp,
    LocationOn,
    PermContactCalendar,
    PermMedia,
    PhoneAndroid,
    PinDrop,
    RampRight,
    ZoomInOutlined
} from "@mui/icons-material";
import UserAvatar from "@/components/common/UserAvatar";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from 'next/link';
import GoogleMapIframe from "@/components/leads/shared/GoogleMapIframe";

const cardStyle = {
    width: {
        xs: '100%',
        md: 320
    },
    minWidth: {
        xs: '100%',
        md: 320
    },
    position: 'relative',
    '& h6': {
        color: '#737373',
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: '1.5rem', // You can use the numeric value directly
        letterSpacing: '0.025rem',
        textTransform: 'uppercase',
    },
    '& h5': {
        color: '#393939',
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: '1.5rem', // You can use the numeric value directly
        letterSpacing: '0.025rem',
    }
}
const cardImageStyle = {
    height: 140,
    position: 'relative',
    '&:after': {
        content: '""',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        background: 'linear-gradient(0, #0000008c, transparent)',
        position: 'absolute'
    }
}
const BusinessCard = ({business}) => {
    const handleLinkClick = (href) => {
        window.open(href, '_blank');
    };
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Stack direction={isMobile ? "column" : "row"} gap={isMobile ? '1rem' : "2rem"}
               padding={isMobile ? '0 0 5rem' : 0}>
            <Stack direction={"column"} gap={isMobile ? '1rem' : "2rem"}>
                <Card sx={cardStyle}>
                    <CardMedia
                        sx={cardImageStyle}
                        image="/images/business-placeholder.webp"
                        title="business name"
                    />
                    <CardContent>
                        <Box sx={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            padding: '0.5rem 1rem',
                            background: 'linear-gradient(188deg, #00000003, #0000004a)',
                            backdropFilter: 'blur(6px)',
                            top: 76, '& p': {
                                color: 'white'
                            }
                        }}>
                            <BusinessNameBlock name={business.name} location={business.location.name}/>
                        </Box>

                        <Stack direction={"column"} gap={"1rem"}>

                            <Stack direction={"column"} gap={"0.5rem"}>
                                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                    <Call fontSize={"small"} sx={{color: '#606060'}}/>
                                    <Typography variant="h6" component="h6">
                                        Landphone Number
                                    </Typography>
                                </Stack>
                                <Typography variant="h5" component="h5">
                                    {isMobile &&
                                        <Link
                                            href={`tel:${business.landphone}`}>
                                            <Chip label={business.landphone} variant={"outlined"}/>
                                        </Link>
                                    }
                                    {!isMobile &&
                                        <>{business.landphone}</>
                                    }
                                </Typography>
                            </Stack>

                            {business.email &&
                                <Stack direction={"column"} gap={"0.5rem"}>
                                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                        <EmailSharp fontSize={"small"} sx={{color: '#606060'}}/>
                                        <Typography variant="h6" component="h6">
                                            Email Address
                                        </Typography>
                                    </Stack>
                                    <Typography variant="h5" component="h5">
                                        <Link
                                            href={`mailto:${business.email}`} style={{color: 'black'}}>
                                            <Typography varient={"h5"}
                                            >{business.email}</Typography>
                                        </Link>
                                    </Typography>
                                </Stack>
                            }


                            {business.contacts.length > 0 &&

                                <>
                                    {business.contacts[0].name &&
                                        <Stack direction={"column"} gap={"0.5rem"}>
                                            <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                                <PermContactCalendar fontSize={"small"} sx={{color: '#606060'}}/>
                                                <Typography variant="h6" component="h6">
                                                    Contact Person
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row"
                                                   alignItems="center"
                                                   sx={{gap: '0.5rem'}}>
                                                <UserAvatar name={business.contacts[0].name}/>
                                                <Stack>
                                                    <Typography varient={"h5"}
                                                    >{business.contacts[0].name}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    }
                                    {business.contacts[0].phone_number &&
                                        <Stack direction={"column"} gap={"0.5rem"}>
                                            <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                                <PhoneAndroid fontSize={"small"} sx={{color: '#606060'}}/>
                                                <Typography variant="h6" component="h6">
                                                    Contact Number
                                                </Typography>
                                            </Stack>
                                            <Typography variant="h5" component="h5">
                                                {isMobile &&
                                                    <Link
                                                        href={`tel:${business.contacts[0].phone_number}`}>
                                                        <Chip label={business.contacts[0].phone_number}
                                                              variant={"outlined"}/>
                                                    </Link>
                                                }
                                                {!isMobile &&
                                                    <>{business.contacts[0].phone_number}</>
                                                }
                                            </Typography>
                                        </Stack>
                                    }
                                </>
                            }


                        </Stack>


                    </CardContent>
                </Card>

                {business.photos.length > 0 &&
                    <Card sx={{width: isMobile ? '100%' : 320, flex: 'none', minWidth: isMobile ? '100%' : 320}}>
                        <CardContent>
                            <Stack direction={"column"} gap={"1rem"}>
                                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                    <PermMedia fontSize={"small"} sx={{color: '#606060'}}/>
                                    <Typography sx={{fontSize: '1rem'}} color="text.dark">
                                        Photos
                                    </Typography>
                                </Stack>

                                {business.photos.length > 0 && business.photos.map((photo, index) => (
                                    <>
                                        <Stack direction={"row"} key={index} justifyContent={"space-between"}
                                               alignItems={"center"}>
                                            <Stack direction={"row"} gap={"1rem"} alignItems={"center"}>
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/photos/business/${photo.business_id}/${photo.name}`}
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        objectFit: "cover",
                                                        borderRadius: '0.5rem'
                                                    }}/>

                                                <Stack direction={"column"} gap={"0"}>
                                                    <Typography sx={{fontSize: '1rem'}} color="text.dark">
                                                        {photo.type === 'card' ? 'Visiting Card' : 'Store Front'}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            <Button
                                                onClick={() => handleLinkClick(`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/photos/business/${photo.business_id}/${photo.name}`)}
                                                startIcon={<ZoomInOutlined fontSize="inherit"/>} aria-label="delete"
                                                size="small">
                                                View
                                            </Button>
                                        </Stack>
                                        <Divider/>
                                    </>
                                ))}

                            </Stack>

                        </CardContent>
                    </Card>
                }
            </Stack>

            <Card sx={{...cardStyle, minWidth: 'none', width: '100%'}}>
                <CardContent sx={{padding: 0, height: '100%'}}>
                    <Stack direction={"row"} gap={"2rem"} alignItems={"top"} sx={{padding: '1rem'}} flexWrap={"wrap"}>
                        <Stack direction={"column"} gap={"0.5rem"}>
                            <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                <RampRight fontSize={"small"} sx={{color: '#606060'}}/>
                                <Typography variant="h6" component="h6">
                                    Route
                                </Typography>
                            </Stack>
                            <Typography variant="h5" component="h5">
                                {business.location.route.name}
                            </Typography>
                        </Stack>

                        <Stack direction={"column"} gap={"0.5rem"}>
                            <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                <PinDrop fontSize={"small"} sx={{color: '#606060'}}/>
                                <Typography variant="h6" component="h6">
                                    Location
                                </Typography>
                            </Stack>
                            <Typography variant="h5" component="h5">
                                {business.location.name}
                            </Typography>
                        </Stack>

                        {business.address &&
                            <Stack direction={"column"} gap={"0.5rem"}>
                                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                    <LocationOn fontSize={"small"} sx={{color: '#606060'}}/>
                                    <Typography variant="h6" component="h6">
                                        Address
                                    </Typography>
                                </Stack>
                                <Typography variant="h5" component="h5">
                                    {business.address}
                                </Typography>
                            </Stack>
                        }
                    </Stack>
                    <Divider/>

                    <GoogleMapIframe mapUrl={business.location_url}/>

                </CardContent>
            </Card>
        </Stack>

    )
}

export default BusinessCard;