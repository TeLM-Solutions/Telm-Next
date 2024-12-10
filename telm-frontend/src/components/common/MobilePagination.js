import {Box, IconButton, Stack} from "@mui/material";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';

const MobilePagination = ({currentPage, lastPage, onPageChange}) => {

    console.log('currentPage', currentPage)
    console.log('lastPage', lastPage)

    const circles = [];
    for (let i = 1; i <= lastPage + 1; i++) {
        const active = i === currentPage + 1;
        circles.push(<Box key={i}
                          sx={{
                              width: 8,
                              height: 8,
                              borderRadius: 8,
                              background: active ? 'linear-gradient(45deg, #7b43d9, #5346ff)' : '#b2d7ff',
                              border: '1px solid #ddd'
                          }}></Box>);
    }

    const handleNextPage = (e) => {
        if (currentPage < lastPage) {
            console.log(currentPage + 1)
            onPageChange(e, currentPage + 1);
        }
    };

    const handlePreviousPage = (e) => {
        if (currentPage > 0) {
            onPageChange(e, currentPage - 1);
        }
    };

    return (
        <Stack padding={"2rem 0 4rem"} justifyContent={"center"} direction={"row"} gap={"4rem"} alignItems={"center"}
        >
            {lastPage != 0 &&
                <>
                    <IconButton onClick={handlePreviousPage}
                                variant="contained"
                                disabled={currentPage == 0}
                                color="info">
                        <ArrowBackIosOutlinedIcon/>
                    </IconButton>
                    <Stack direction={"row"} gap={"0.5rem"} flexWrap={"wrap"}
                           justifyContent={"center"}>{circles}</Stack>
                    <IconButton onClick={handleNextPage}
                                disabled={currentPage == lastPage}
                                variant="contained" color="info">
                        <ArrowForwardIosOutlinedIcon/>
                    </IconButton>
                </>
            }
        </Stack>
    );
}

export default MobilePagination;