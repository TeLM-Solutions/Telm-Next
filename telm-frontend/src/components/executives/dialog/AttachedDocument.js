import {Box, IconButton, Stack} from "@mui/material";
import {ArticleOutlined, DownloadForOffline, PictureAsPdf} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import CancelIcon from '@mui/icons-material/Cancel';

const AttachedDocument = ({document, showDelete = true, showDownload = false}) => {

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };

    const handleLinkClick = (href) => {
        window.open(href, '_blank');
    };

    // Define a function to handle different MIME types
    const getDocumentContent = () => {
        switch (document.mime_type) {
            case "image/png":
                return (
                    <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${document.file_path}`}
                    />
                );
            case "application/pdf":
                return <PictureAsPdf sx={{color: "white"}}/>;
            default:
                return <ArticleOutlined sx={{color: "blue"}}/>;
        }
    };

    return (
        <Stack
            sx={{
                background: "linear-gradient(70deg, #dfefff, transparent)",
                padding: "0.5rem",
                borderRadius: "0.3rem",
                border: "1px solid #cae1ff",
                position: "relative",
                gap: "1rem",
            }}
            direction={"row"}
            alignItems={"center"}
        >
            <Box
                onClick={() => handleLinkClick(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${document.file_path}`)}
                sx={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 0 0.5rem #a2c0f6",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: 'pointer',

                    background:
                        document.mime_type === "application/pdf" ? "rgb(226, 81, 73)" : "#fff",
                    "& img": {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    },
                }}
            >
                {getDocumentContent()}
            </Box>
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flex={1}
            >
                <Typography
                    onClick={() => handleLinkClick(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${document.file_path}`)}
                    sx={{
                        fontSize: "0.875rem",
                        flex: 1,
                        cursor: 'pointer'
                    }}
                >
                    {document.file_name}
                </Typography>
                {showDelete &&
                    <IconButton color={"error"}>
                        <CancelIcon fontSize={"small"}/>
                    </IconButton>
                }
                {showDownload &&
                    <IconButton color={"info"}
                                onClick={() => handleLinkClick(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${document.file_path}`)}>
                        <DownloadForOffline fontSize={"small"}/>
                    </IconButton>
                }

            </Stack>
        </Stack>
    );
};

export default AttachedDocument;