import React from "react";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import { Button } from "@mui/material";


// Footer inspired by https://www.youtube.com/watch?v=HCsFwwolXZw&ab_channel=LevelUpDeveloper
export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <footer
            style={{
                position: "fixed",
                left: "0",
                bottom: "0",
                width: "100%",
                marginTop: "150%"
            }}
        >
            <Box
                bgcolor="#7E7ACC"
                color="white"
            >
                <Container maxWidth="sm">
                    <div
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                        }}>
                        <b align="center"
                        style={{
                            marginTop: "10px",
                        }}
                        >Copyright &copy; Restify {new Date().getFullYear()}. All rights reserved.</b>

                    </div>
                    <br />
                    <div
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                        }}
                    >

                        <Button
                            sx={{
                                mb: 1
                            }}
                            variant="contained" onClick={() => {
                                scrollToTop();
                            }}
                        >
                            Back to Top
                        </Button>
                    </div>
                </Container>
            </Box>
        </footer>
    );
}