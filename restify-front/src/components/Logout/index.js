import {Navigate} from 'react-router-dom';
import Cookies from 'universal-cookie';
import { APIContext } from '../../Contexts/APIContext';
import { useContext } from 'react';
import * as React from 'react';

export default function Logout(){
    const {setToken} = React.useContext(APIContext);
    const {setuserData} = React.useContext(APIContext);
    const cookies = new Cookies();
    cookies.remove('access_token', { path: '/' });
    cookies.remove('access_token', { path: '/signin/' });

    // set the token to null
    React.useEffect(()=>{
        if (!setToken){
            return;
        }
        setToken(null);
    },[setToken])

    // set the user data to null
    React.useEffect(()=>{
        if (!setuserData){
            return;
        }
        setuserData({
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
          });
    },[setuserData])

    console.log("logout");
    return (
        <Navigate to="/"/>
    )
}