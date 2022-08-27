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
import { APIContext } from '../../../Contexts/APIContext';
import { useEffect } from 'react';
import { useState } from 'react';
import Container from '@mui/material/Container';
import { border } from '@mui/system';
import background from "./img/clean.png";



export default function NewRestaurantCreate() {

    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantPostalCode, setRestaurantPostalCode] = useState("");
    const [restaurantPhone, setRestaurantPhone] = useState("");
    const {setRestaurantOwner} = React.useContext(APIContext);

    return <>
        <div className="row"
            style={{
                height: "100vh",
                backgroundImage: `url(${background})`,

                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="column" style={{
                marginTop: "250px",
            }}>
                <section>
                    <div className="container">
                        <div className="col-lg-5 col-md-6 div3" style={{
                            marginTop: "200px",
                            margin: "auto",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid black",
                            borderRadius: "10px",
                            padding: "20px",
                            backgroundColor: "white",
                        }}>
                            <h1 align="center">Create Restaurant</h1>
                            <br />
                            <input type="text" className="form-control" placeholder="Restaurant Name" aria-label="restaurantName" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />
                            <br />
                            <input type="text" className="form-control" placeholder="Restaurant Address" aria-label="restaurantAddress" value={restaurantAddress} onChange={(e) => setRestaurantAddress(e.target.value)} />
                            <br />
                            <input type="text" className="form-control" placeholder="Restaurant Postal Code" aria-label="restaurantPostalCode" value={restaurantPostalCode} onChange={(e) => setRestaurantPostalCode(e.target.value)} />
                            <br />
                            <input type="text" className="form-control" placeholder="Restaurant Phone" aria-label="restaurantPhone" value={restaurantPhone} onChange={(e) => setRestaurantPhone(e.target.value)} />
                            <br />
                            <button className="btn btn-primary" onClick={() => {
                                const cookies = new Cookies();
                                const formData = new FormData();

                                // TODO Submit form here to send data to backend
                                const url = config.baseurl + "/restaurant_general/information/"
                                const data = {
                                    name: restaurantName,
                                    address: restaurantAddress,
                                    postal_code: restaurantPostalCode,
                                    phone: restaurantPhone,
                                }
                                console.log(data);
                                for (const name in data) {
                                    formData.append(name, data[name]);
                                }
                                fetch(url, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': 'Bearer ' + cookies.get('access_token'),
                                    },
                                    body: formData
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(data);
                                        if (data.id) {
                                            setRestaurantOwner(data);
                                            // redirect to restaurant page
                                            window.location.href = "/myrestaurant";
                                        }else{
                                            var error = "";
                                            // iterate the data object
                                            for (var key in data) {
                                                error += key+":"+data[key] + "\n";
                                            }
                                            alert(error);
                                        }
                                    }
                                    )
                            }}>Create</button>

                            <br /><br />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </>

}