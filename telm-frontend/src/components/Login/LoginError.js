import {Alert} from "@mui/material";

const LoginError = ({ messages = []}) => (
    <>
        {messages.length > 0 && (
            <>
                {messages.map((message, index) => (
                    <Alert severity="error" key={index}>{message}</Alert>
                ))}
            </>
        )}
    </>
)

export default LoginError