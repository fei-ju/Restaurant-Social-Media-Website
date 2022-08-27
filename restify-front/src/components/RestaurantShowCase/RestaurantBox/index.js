// using bootstrap box show a list of restaurants with images 

import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';

const RestaurantBox = ({restaurant}) => {
//   const restaurant ={
//       id: 1,
//     name: 'Test name',
//     image: 'http://127.0.0.1:8000/images/static/images/qq.png',
//     address: ' test address address address',
//   }

    return (
        <>
            <Box
                as={Link}
                to={`/restaurant/${restaurant.id}/`}
                sx={{
                    width: '250px',
                    height: '300px',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: '10px',
                    m: '10px',

                }}
                onClick={() => {
                    window.location.href = `/restaurant/${restaurant.id}/`;
                }}

                >
                <img src={restaurant.logo} style={{ width: '70%' }} />
                                <h3>{restaurant.name}</h3>
                                <p>{restaurant.address}</p>
                </Box>
        </>
        )};


export default RestaurantBox;