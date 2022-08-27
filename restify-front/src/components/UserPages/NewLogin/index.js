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



export default function NewLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setToken } = React.useContext(APIContext);
    

    return <>
        <div className="row"
            style={{
                backgroundImage: `url(${background})`,
                height:"100vh",
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
                                <h1 align="center">Login</h1>
                               <br/>
                                <input type="text" className="form-control" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <br />
                                <input type="password" className="form-control" placeholder="Password" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <br />
                                <Button variant="contained" color="primary" 
                                onClick={()=>{
                                    const url = config.baseurl+"/user/login/"
                                    fetch(url, {
                                      method: 'POST',
                                      headers:{
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        email: email,
                                        password: password,
                                      },
                                
                                      )})
                                      .then(res => res.json())
                                      .then(res => {
                                        if (res.access) {
                                          setToken(res.access)
                                          const cookies = new Cookies();
                                          cookies.set('access_token', res.access, { path: '/' });
                                          alert("Login Successful")
                                          window.location.href = "/";
                                        }else{
                                            alert("Login Failed")
                                        }
                                        
                                      })
                                }}
                                >Sign in</Button>
                                <br/><br/>
                                <a href="/signup/">Don't have an account yet?</a>
                        </div>
                        </div>
                </section>
            </div>
        </div>
    </>

}