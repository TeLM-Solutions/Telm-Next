import {Box, Button, CircularProgress, Collapse, IconButton, Stack} from "@mui/material";
import {ArticleOutlined, DownloadForOffline} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import {useState} from "react";
import {useAuth} from "@/hooks/auth";

const JobDocumentList = ({document, id, onClickDelete, isDeleting, deleteId}) => {

    const [showDelete, setShowDelete] = useState(false);
    const {user: loggedUser} = useAuth({middleware: 'auth'})

    const handleDelete = () => {
        setShowDelete(!showDelete)
    }

    const handleLinkClick = () => {
        const href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/jobs/documents/${id}/${document.file_name}`
        window.open(href, '_blank');
    };

    const handleConfirmDelete = (document_id) => {
        setShowDelete(false)
        onClickDelete(document_id)
    }

    // Define a function to handle different MIME types
    return (
        <Stack gap={0}>
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
                    onClick={() => handleLinkClick()}
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
                    <ArticleOutlined sx={{color: "blue"}}/>
                </Box>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    flex={1}
                >
                    <Stack>
                        <Typography
                            onClick={() => handleLinkClick()}
                            sx={{
                                fontSize: "0.875rem",
                                flex: 1,
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            {document.type.title}
                        </Typography>
                        <Typography
                            onClick={() => handleLinkClick()}
                            sx={{
                                fontSize: "0.755rem",
                                flex: 1,
                                cursor: 'pointer'
                            }}
                        >
                            {document.file_name}
                        </Typography>
                    </Stack>

                    <Stack direction={"row"} alignItems={"center"}>

                        <IconButton color={"info"}
                                    onClick={() => handleLinkClick()}>
                            <DownloadForOffline fontSize={"small"}/>
                        </IconButton>
                        {(loggedUser.id === document.user_id || loggedUser.role === 'manager') &&
                            <>
                                {!isDeleting && deleteId != document.id &&
                                    <IconButton color={"error"} onClick={() => handleDelete()}>
                                        <CancelIcon fontSize={"small"}/>
                                    </IconButton>
                                }
                                {isDeleting && deleteId == document.id &&
                                    <CircularProgress size={"1rem"}/>
                                }
                            </>
                        }
                    </Stack>

                </Stack>

            </Stack>
            <Stack
            >
                <Collapse in={showDelete} unmountOnExit>
                    <Stack gap={"1rem"} sx={{
                        background: 'linear-gradient(189deg, #ffa9a9, #ffe3e3)',
                        top: '-2px',
                        position: 'relative',
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8
                    }} padding={"1rem"}>
                        <Typography
                            onClick={() => handleLinkClick()}
                            sx={{
                                fontSize: "0.875rem",
                                flex: 1,
                                color: '#380000'
                            }}
                        >
                            Are you sure want to delete this document?
                        </Typography>
                        <Stack direction={"row"} gap={"1rem"}>
                            <Button variant={"contained"} color={"error"}
                                    disabled={isDeleting}
                                    onClick={() => handleConfirmDelete(document.id)}>Yes</Button>
                            <Button sx={{color: 'black'}} onClick={() => handleDelete()}
                                    disabled={isDeleting}>Cancel</Button>
                        </Stack>
                    </Stack>
                </Collapse>
            </Stack>
        </Stack>
    );
};

export default JobDocumentList;