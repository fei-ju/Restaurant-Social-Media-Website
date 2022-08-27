import React from 'react';
import { Card, makeStyles } from '@material-ui/core';
import { CardMedia } from '@mui/material';

// Code taken from https://levelup.gitconnected.com/adding-transitions-to-a-react-carousel-with-material-ui-b95825653c1b
export default function CarouselSlide(props) {
    const { picture } = props.content;

    const useStyles = makeStyles(() => ({
        card: {
            borderRadius: 10,
            padding: '75px 50px',
            margin: '0px 250px',
            width: '500px',
            height: '300px',
            boxShadow: '20px 20px 20px black',
            display: 'flex',
            justifyContent: 'center',
        }
    }));

    const Style = useStyles();

    return (
        <Card>
            <CardMedia
                component="img"
                image={picture}
                alt="Image Title"
                style={Style}
            />
        </Card>
    );
}