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
    const { setToken, userData,setUserData } = React.useContext(APIContext);
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState("")
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [file, setFile] = useState(undefined);


    useEffect(() => {
        setEmail(userData.email);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setPhoneNumber(userData.phone_number);
        setAvatar(userData.avatar);
        console.log("logo", userData.avatar);


    }, [userData])



    return <>
        <div className="row"
            style={{
                // backgroundImage: `url(${background})`,
                height: "100vh",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="column" style={{
                marginTop: "100px",
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
                            <h1 align="center">Edit Profile</h1>
                            <br />
                            <img src={avatar} style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                border: "1px solid black",
                                margin: "auto",
                                display: "block",
                                marginTop: "20px",
                                marginBottom: "20px",
                            }} />
                            <br />
                            <label>Email</label>
                            <input type="text" className="form-control" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <br />
                            <label>First Name</label>
                            <input type="text" className="form-control" placeholder="First Name" aria-label="First Name" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                            <br />
                            <label>Last Name</label>
                            <input type="text" className="form-control" placeholder="Last Name" aria-label="Last Name" value={last_name} onChange={(e) => setLastName(e.target.value)} />
                            <br />
                            <label>Phone Number</label>
                            <input type="text" className="form-control" placeholder="Phone Number" aria-label="Phone Number" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} />
                            <br />
                            <label>Avatar</label>
                            <input type="file" className="form-control" placeholder="Avatar" aria-label="Avatar"  onChange={(e) => setFile(e.target.files[0])} />
                            <br />



                            <Button variant="contained" color="primary"
                                onClick={() => {
                                    const url = config.baseurl + "/user/edit/"
                                    const formData = new FormData();
                                    const data = {
                                        email: email,
                                        first_name: first_name,
                                        last_name: last_name,
                                        phone_number: phone_number,
                                    }
                                    if (file) {
                                        formData.append("avatar", file);
                                        console.log("file", file);
                                    }
                                    console.log(data);
                                    for (const name in data) {
                                        formData.append(name, data[name]);
                                    }
                                    fetch(url, {
                                        method: 'PATCH',
                                        headers: {
                                            'Authorization': 'Bearer ' + new Cookies().get('access_token'),
                                        },
                                        body: formData
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            console.log("Profile",data);
                                            setUserData(data);
                                        })
                                }}
                            >Save</Button>
                            <br /><br />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </>

}