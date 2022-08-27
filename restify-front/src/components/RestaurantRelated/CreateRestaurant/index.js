import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import config from "../../../config.json";
import Cookies from 'universal-cookie';
import {APIContext} from '../../../Contexts/APIContext';
import {useContext} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import Container from '@mui/material/Container';


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

export default function CreateRestaurant(){

    const [restaurantName,setRestaurantName] = useState("");
    const [restaurantAddress,setRestaurantAddress] = useState("");
    const [restaurantPostalCode,setRestaurantPostalCode] = useState("");
    const [restaurantPhone,setRestaurantPhone] = useState("");

    const {token,setRestaurantOwner} = React.useContext(APIContext);


    const handleSubmit = (event) => {
    event.preventDefault();
    const form_data = new FormData(event.currentTarget);
    const formData  = new FormData();

    // TODO Submit form here to send data to backend
    const url = config.baseurl+"/restaurant_general/information/"
    const data  = {
        name: form_data.get('restaurantName'),
        address: form_data.get('restaurantAddress'),
        postal_code: form_data.get('restaurantPostalCode'),
        phone: form_data.get('restaurantPhone'),
    }
    console.log(data);
    for(const name in data) {
        formData.append(name, data[name]);
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+token,
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.id){
            setRestaurantOwner(data);   
            // redirect to restaurant page
            window.location.href = "/myrestaurant";
        }
    }
    )
    
      
  };



     
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            
            <Typography component="h1" variant="h5">
              Create Restaurant
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center">
  
                  <Avatar alt="Current Profile Picture" src="../../restify-back/static/images/default.png" /> 
                </Grid>
                
                <Grid item xs={12} >
                  <TextField
                    name="restaurantName"
                    required
                    fullWidth
                    id="restaurantName"
                    label="Restaurant Name"
                    autoFocus
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="restaurantAddress"
                    label="Restaurant Address"
                    name="restaurantAddress"
                    value={restaurantAddress}
                    onChange={(e) => setRestaurantAddress(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="restaurantPostalCode"
                    label="PostalCode"
                    name="restaurantPostalCode"
                    value={restaurantPostalCode}
                    onChange={(e) => setRestaurantPostalCode(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="restaurantPhone"
                    label="Phone Number"
                    name="restaurantPhone"
                    value={restaurantPhone}
                    onChange={(e) => setRestaurantPhone(e.target.value)}
                  />
                </Grid>
  
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Restaruant
              </Button>
            </Box>
          </Box>
          <Copyright sx={{ mt: 2 }} />
        </Container>
      </ThemeProvider>
    );

} 