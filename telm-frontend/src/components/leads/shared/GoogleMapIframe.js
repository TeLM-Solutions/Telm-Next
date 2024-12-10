import React from 'react';
import Link from "next/link";
import {Box, Chip, Stack} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const GoogleMapIframe = ({mapUrl}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    if (mapUrl) {
        if (isGoogleMapsURL(mapUrl)) {
            return (
                <Box sx={{height: isMobile ? 320 : 480}}>
                    <iframe
                        src={mapUrl + "&z=14&output=embed"}
                        width="100%"
                        height="100%"
                        style={{border: 0}}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </Box>
            );
        } else {
            return (
                <Stack justifyContent={"center"} alignItems={"center"}
                       sx={{
                           height: isMobile ? 320 : '90%',
                           background: 'url(/images/map-default.webp)',
                           backgroundSize: 'cover'
                       }}>
                    <Link href={mapUrl} target={"_blank"}>
                        <Chip color="primary"
                              sx={{fontSize: '1rem', padding: '0.5rem', minHeight: '3.5rem', background: '#fff'}}
                              icon={<LocationOnIcon fontSize={"small"}/>}
                              variant={"outlined"}
                              label={"View on Google Map"}/>
                    </Link>
                </Stack>

            )
        }
    } else {
        return (
            <Stack justifyContent={"center"} alignItems={"center"} sx={{
                height: isMobile ? 320 : '90%',
            }}>
                <Chip color="error"
                      sx={{fontSize: '1rem', padding: '0.5rem', minHeight: '3.5rem', background: '#fff'}}
                      icon={<LocationOnIcon fontSize={"small"}/>}
                      variant={"outlined"}
                      label={"No Map URL provided"}/>
            </Stack>

        )
    }


};

export default GoogleMapIframe;


const isGoogleMapsURL = (url) => {
    const regex = /^https?:\/\/maps\.google\.com\/\?q=\-?\d+(\.\d+)?,\-?\d+(\.\d+)?$/;
    return regex.test(url);
};