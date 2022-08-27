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



export default function NewSignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");


    const { setToken } = React.useContext(APIContext);

    return <>
        <div className="row"
            style={{
                backgroundImage: `url(${background})`,
                height: "100vh",
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
                            <h1 align="center">Sign up</h1>
                            <br />
                            <input type="text" className="form-control" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <br />
                            <input type="password" className="form-control" placeholder="Password" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <br />
                            <input type="text" className="form-control" placeholder="First Name" aria-label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            <br />
                            <input type="text" className="form-control" placeholder="Last Name" aria-label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            <br />
                            <input type="text" className="form-control" placeholder="Phone Number" aria-label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <br />
                            <Button variant="contained" color="primary"
                                onClick={() => {
                                    const url = config.baseurl + "/user/register/"
                                    // fetch with multipart/form-data header
                                    const formData = new FormData();
                                    const data = {
                                        email: email,
                                        password: password,
                                        first_name: firstName,
                                        last_name: lastName,
                                        phone_number: phone,
                                    }
                                    console.log(data);
                                    for (const name in data) {
                                        formData.append(name, data[name]);
                                    }
                                    fetch(url, {
                                        method: 'POST',
                                        body: formData
                                    })
                                        .then(data => {
                                            if (data.status===201) {
                                                alert("Successfully registered");
                                                window.location.href = "/signin/";
                                            }else{
                                                var error = "Failed to register,Check if you've filled in all the fields or there's already an account with this email\n";
                                                // iterate the data object
                                                // for (var key in data) {
                                                //     error += key+":"+data[key] + "\n";
                                                // }
                                                alert(error);
                                            }
                                        })
                                }}
                            >Sign up</Button>
                            <br /><br />
                            <a href="/signin/">Already have an account?</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </>

}