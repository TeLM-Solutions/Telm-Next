import {Button, Stack} from "@mui/material";
import {NotInterested} from "@mui/icons-material";
import React from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";

const FilterBox = ({isCardExpanded, children, onClickHide, filterAppliedCount, onFilterReset}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const closeAndClearFilter = () => {
        onClickHide();
        setTimeout(() => {
            onFilterReset();
        }, 300)
    }

    return (
        <>
            <Drawer sx={{'& .MuiPaper-root': {width: {xs: '90%', md: 380}}}} anchor={"right"} open={isCardExpanded}
                    timeout="auto"
                    onClose={onClickHide}>
                <Stack gap={"1rem"} padding={"2rem"}>
                    {children}
                </Stack>
            </Drawer>
            {isMobile && isCardExpanded &&
                <Stack

                    alignItems={"center"}
                    justifyContent={"space-between"}
                    direction={"row"} sx={{
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: '1rem',
                    background: '#fff',
                    zIndex: 1,
                    boxShadow: '0 0 10px #b4b4b4'
                }}>
                    <Button variant={"contained"} onClick={onClickHide}>
                        Close Filter
                    </Button>
                    {filterAppliedCount > 0 &&
                        <Button onClick={closeAndClearFilter} color={"error"} startIcon={<NotInterested/>}>Clear
                            Filters</Button>
                    }
                </Stack>

            }
        </>
    )
}
export default FilterBox;