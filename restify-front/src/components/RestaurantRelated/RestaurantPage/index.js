import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import config from "../../../config.json";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ClassNames } from '@emotion/react';
import CarouselSlide from './carouselPic';


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Restify
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();
const Style = {
    height: 300,
    width: 500,
};

export default function RestaurantPage() {

    // Get all restaurant picture urls and add them here...
    const RESTAURANT_PICS = []

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="1">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >

                    <Typography component="h1" variant="h5">
                        [Restaurant Name]
                    </Typography>

                    <Grid container>
                        <Grid item xs={12} container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center">

                            <CarouselSlide
                                content={{ picture: 'https://picsum.photos/200/300' }}
                            />

                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12} container
                            spacing={0}
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                        >

                            <Card sx={{ mt: 2, mr: 2 }}>
                                Followers: [420]
                            </Card>

                            <Card sx={{ mt: 2, mr: 2 }}>
                                Likes: [1337]
                            </Card>

                            <Card sx={{ mt: 2 }}>
                                Comments: [69]
                            </Card>

                        </Grid>
                    </Grid>

                    <Grid sx={{ mt: 4 }} container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    width = "75%"
                    >
                        <Grid item xs={6}>
                            <Card>
                                Appetizers
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card>
                                Main Courses
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card>
                                Drinks
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card>
                                Desserts
                            </Card>
                        </Grid>
                    </Grid>

                    <Card sx={{ mt: 3 }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    R
                                </Avatar>
                            }
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title="Post Title"
                            subheader="Post Date"
                        />

                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                nisi ut aliquip ex ea commodo ...
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                            >
                                View Post
                            </Button>
                        </CardActions>
                    </Card>

                </Box>
                <Copyright sx={{ mt: 2 }} />
            </Container>
        </ThemeProvider>
    );
}