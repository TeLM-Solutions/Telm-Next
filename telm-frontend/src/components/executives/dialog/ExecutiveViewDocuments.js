import {Box, Divider, Stack, Typography} from "@mui/material";
import {StyledPaper} from '@/styles/styles';
import AttachedDocument from "@/components/executives/dialog/AttachedDocument";
import TableEmpty from "@/components/common/TableEmpty";

const ExecutiveViewDocuments = ({documents}) => {
    return (
        <>
            <Box sx={StyledPaper}>
                <Box className={"heading has-button"}>
                    <Typography>Documents</Typography>
                </Box>
                <Divider/>
                <Box className={"services"}>
                    <Stack gap={"1rem"}>
                        {documents.length > 0 && documents.map((document, index) => (
                            <AttachedDocument showDownload={true} showDelete={false} key={index}
                                              document={document}/>
                        ))}
                        {documents.length === 0 &&
                            <TableEmpty message={"No documents to display"}/>
                        }
                    </Stack>
                </Box>
            </Box>


        </>
    )
}

export default ExecutiveViewDocuments;