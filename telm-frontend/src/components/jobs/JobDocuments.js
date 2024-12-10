import React, {useEffect, useMemo, useState} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import fetchCSRFToken from "@/lib/getToken";
import {Dashboard} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    MenuItem,
    Stack,
    TextField
} from "@mui/material";
import {Upload} from "@mui/icons-material";
import {useDispatch, useSelector} from "@/store";
import {fetchJobDocumentTypes} from "@/store/slices/jobDocumentTypesSlice";
import {deleteJobDocument, fetchJobDocuments} from "@/store/slices/jobSlice";
import TableEmpty from "@/components/common/TableEmpty";
import JobDocumentList from "@/components/jobs/shared/JobDocumentList";

const JobDocuments = ({tab, id}) => {
    const [CSRF, setCSRF] = useState(null)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [isUploading, setIsUploading] = useState(false);
    const {loading, job_document_types} = useSelector((state) => state.jobDocumentTypes);
    const {documents} = useSelector((state) => state.jobs);

    const [isLoading, setIsLoading] = useState(true)

    const [selectedDocumentType, setSelectedDocumentType] = useState(0); // State to track selected document type
    const [isFileAdded, setIsFileAdded] = useState(false); // State to track uploaded files

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState(0);

    const dispatch = useDispatch();

    const initializeUppyWithCSRF = (csrfToken) => {
        return new Uppy({
            restrictions: {
                maxNumberOfFiles: 1,
                allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            },
            autoProceed: false,
        }).use(XHRUpload, {
            endpoint: process.env.NEXT_PUBLIC_BACKEND_URL + '/api/jobs/upload/documents',
            formData: true,
            fieldName: 'file',
            withCredentials: true,
            limit: 1,
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                // Other headers if needed
            },
        }).on("file-added", (file) => {
            setIsFileAdded(true);
        }).on("file-removed", (file) => {
            setIsFileAdded(false);
        });
    };

    const getToken = async () => {
        const csrf = await fetchCSRFToken();
        setCSRF(csrf);
    };

    const getData = async () => {
        await getToken();
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchJobDocumentTypes());
                await dispatch(fetchJobDocuments(id));
                setIsLoading(false)
            } catch (error) {
                // Handle errors
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [dispatch])

    if (tab === 3 && CSRF === null) {
        getData();
    }

    const uppyDocuments = useMemo(() => {
        if (CSRF !== null) {
            return initializeUppyWithCSRF(CSRF);
        }
        return null; // Return null if CSRF is not available yet
    }, [CSRF]);

    const handleDocumentTypeChange = (event) => {
        setSelectedDocumentType(event.target.value);
    };

    const isButtonDisabled = selectedDocumentType === 0 || !isFileAdded

    const handleSubmit = () => {
        try {
            if (uppyDocuments.getFiles().length > 0) {
                setIsUploading(true)
                uppyDocuments.setMeta({
                    type: selectedDocumentType,
                    id: id,
                });
                uppyDocuments.upload();
                uppyDocuments.on('complete', async (file, response) => {
                    uppyDocuments.cancelAll()
                    setIsFileAdded(false)
                    setSelectedDocumentType(0)
                    await dispatch(fetchJobDocuments(id));
                    setIsUploading(false)
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleDeleteDocument = async (document_id) => {
        setIsDeleting(true)
        setDeleteId(document_id);
        await dispatch(deleteJobDocument(document_id));
        await dispatch(fetchJobDocuments(id));
        setIsDeleting(false)
    }

    return (
        <>
            {isLoading &&
                <Box sx={{height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <CircularProgress/>
                </Box>
            }
            {!isLoading &&
                <Stack direction={{
                    xs: 'column',
                    md: 'row'
                }} gap={"2rem"}>

                    <Card sx={{flex: 1}}>
                        <CardHeader titleTypographyProps={{fontSize: '1rem', fontWeight: 500}}
                                    title={"Documents"}></CardHeader>
                        <CardContent>
                            <Stack gap={"0.5rem"}>
                                {documents.length > 0 &&
                                    documents
                                        .slice() // Create a copy of the array to avoid mutating the original
                                        .sort((a, b) => b.id - a.id) // Sort the array by id in descending order
                                        .map((document, index) => (
                                            <JobDocumentList key={index} document={document} id={id}
                                                             onClickDelete={handleDeleteDocument}
                                                             deleteId={deleteId}
                                                             isDeleting={isDeleting}/>
                                        ))}
                            </Stack>

                            {documents.length === 0 &&
                                <TableEmpty message={"No documents to display"}/>
                            }
                        </CardContent>
                    </Card>

                    <Card sx={{
                        width: {
                            xs: '100%',
                            md: 380
                        }, height: 'fit-content'
                    }}>
                        <CardHeader titleTypographyProps={{fontSize: '1rem', fontWeight: 500}}
                                    title={"Upload New Document"}></CardHeader>
                        <CardContent sx={{
                            "& .uppy-Dashboard-browse": {
                                background: '#d1d1ff',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem'
                            },
                            "& .uppy-Dashboard-inner": {
                                border: '1px dashed #d5d5d5',
                                borderRadius: '0.5rem'
                            },
                            "& .uppy-Dashboard-Item-name": {
                                width: 180,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: 14
                            },
                            "& .uppy-Dashboard-progressindicators": {
                                display: 'none'
                            },
                            "& .uppy-Dashboard-Item-previewIcon": {
                                width: 48,
                                height: 48,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                "& > svg": {
                                    width: 48,
                                    height: 48
                                }
                            },
                            "& .uppy-Dashboard-Item-preview": {
                                '& img': {
                                    width: 48,
                                    height: 48
                                },
                                '& .uppy-Dashboard-Item-previewInnerWrap': {
                                    width: 48,
                                    height: 48,
                                    background: 'none !important'
                                },
                                '& .uppy-Dashboard-Item-previewIconWrap': {
                                    '& > svg': {
                                        display: 'none'
                                    }
                                },
                                '& .uppy-Dashboard-Item-progressIndicator': {
                                    position: 'absolute',
                                    top: '5px',
                                    transform: 'scale(0.4)',
                                    right: '-10px'
                                }
                            }
                        }}>
                            <Stack gap={"1rem"}>
                                <TextField
                                    fullWidth
                                    required
                                    id="select-types"
                                    select
                                    label="Document Type"
                                    value={selectedDocumentType}
                                    onChange={handleDocumentTypeChange}
                                    placeholder={"Select"}
                                >
                                    {job_document_types.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.title}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {CSRF && (
                                    <Dashboard
                                        uppy={uppyDocuments}
                                        hideUploadButton
                                        width={"100%"}
                                        height={'fit-content'}
                                        plugins={['FileInput']}
                                        note={"only PDF, DOC, DOCX, JPEG, PNG are accepted"}
                                        proudlyDisplayPoweredByUppy={false}
                                        locale={{
                                            strings: {
                                                browseFiles: 'Browse a file',
                                                dropPasteFiles: 'Drop a file here or %{browseFiles}',
                                            }
                                        }}
                                    />
                                )}
                            </Stack>

                            <CardActions sx={{padding: '1rem 0 0'}}>
                                <Button
                                    onClick={() => handleSubmit()}
                                    variant={"contained"}
                                    startIcon={<Upload/>}
                                    disabled={isButtonDisabled || isUploading}
                                >
                                    Upload
                                </Button>
                            </CardActions>
                        </CardContent>
                    </Card>


                </Stack>
            }

        </>
    )
}
export default JobDocuments