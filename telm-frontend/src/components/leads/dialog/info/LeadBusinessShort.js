import {Box, Button, Chip, Divider, Stack, Typography} from "@mui/material";
import {StyledPaper} from '../../../../styles/styles';
import {ArrowRightOutlined, EmailSharp} from "@mui/icons-material";
import ColorBox from "@/components/common/ColorBox";
import Link from "next/link";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const LeadBusinessShort = ({business, onClickMore}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Box sx={StyledPaper}>
            <Box className={"heading has-button"}>
                <Typography>Business</Typography>
                <Button onClick={onClickMore} color={"info"} size={"small"} variant={"text"}
                        endIcon={<ArrowRightOutlined/>}>View
                    More</Button>
            </Box>
            <Divider/>
            <Box className={"services"}>

                {business.address &&
                    <Stack direction={"column"} gap={"0.5rem"} sx={{marginBottom: '1rem', paddingBottom: '1rem'}}>
                        <Typography variant={"h5"}>Address</Typography>
                        <Typography>{business.address}</Typography>
                    </Stack>
                }

                <Stack direction={"row"} gap={"3rem"} flexWrap={"wrap"}>

                    {business.email &&
                        <Stack direction={"column"} gap={"0.5rem"}>

                            <Typography variant={"h5"}>Email Address</Typography>
                            <Link
                                href={`mailto:${business.email}`}>
                                <Chip label={business.email} sx={{fontSize: '1rem', paddingLeft: '0.5rem'}}
                                      icon={<EmailSharp fontSize={"sm"}/>}
                                      variant={"outlined"}/>
                            </Link>


                        </Stack>
                    }

                    <Stack direction={"column"} gap={"0.5rem"}>

                        <Typography variant={"h5"}>Route</Typography>
                        <Typography>{business.location.route.name}</Typography>

                    </Stack>

                    <Stack direction={"column"} gap={"0.5rem"}>

                        <Typography variant={"h5"}>Location</Typography>
                        <Typography>{business.location.name}</Typography>

                    </Stack>

                    {business.contacts.length > 0 &&

                        <>
                            {business.contacts[0].name &&
                                <Stack direction={"column"} gap={"0.5rem"}>

                                    <Typography variant={"h5"}>Contact Person</Typography>
                                    <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                                        <ColorBox text={business.contacts[0]?.name}/>
                                        <Typography>{business.contacts[0]?.name}</Typography>
                                    </Stack>


                                </Stack>
                            }
                            {business.contacts[0].phone_number &&
                                <Stack direction={"column"} gap={"0.5rem"}>

                                    <Typography variant={"h5"}>Contact Number</Typography>

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

                                </Stack>
                            }
                        </>
                    }


                </Stack>

            </Box>
        </Box>
    )
}

export default LeadBusinessShort;