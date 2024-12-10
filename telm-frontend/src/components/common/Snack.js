import {Alert, Slide, Snackbar} from "@mui/material";
import React, {useEffect, useRef} from "react";

function TransitionRight(props) {
    return <Slide {...props} direction="right"/>;
}

const Snack = ({showSnack, snackMessage, onClose}) => {
    const audioRef = useRef(null);

    const playToastSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
            // Stop the sound after 2 seconds
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            }, 2000);
        }
    };

    useEffect(() => {
        if (showSnack) {
            playToastSound();
        }
    }, [showSnack]);

    return (
        <div>
            <audio id="toastSound" ref={audioRef}>
                <source src="/bell.mp3" type="audio/mpeg"/>
            </audio>
            <Snackbar
                open={showSnack}
                onClose={onClose}
                autoHideDuration={4000}
                TransitionComponent={TransitionRight}
            >
                <Alert
                    variant="filled"
                    severity="success"
                    sx={{
                        width: "100%",
                        background: "linear-gradient(358deg, #4ca25a, #3f79a2)",
                    }}
                >
                    {snackMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default React.memo(Snack);