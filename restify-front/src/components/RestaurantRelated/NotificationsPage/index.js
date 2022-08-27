
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
import {useEffect} from 'react';
import {useState} from 'react';
import Container from '@mui/material/Container';


class NotificationComponents   extends React.Component{

    render(){
        const {id,type,content,setNeedReload} = this.props;
        return (<a className="list-group-item list-group-item-action list-group-item-primary"  >
        <div className="d-flex w-100 justify-content-between">
            <b className="mb-1">New Notification</b>
            <Button
            onClick={this.delete_notification}
            >❌</Button>
        </div>
        <small style={{
            marginLeft: "10px"
        }}>{content}</small>
    </a>)
    
    ;
    }

    delete_notification = () => {
        console.log(this)
        const id = this.props.id;
        const cookies = new Cookies();
        fetch(config.baseurl+"/user/notifications/"+id+"/",{
            method: "DELETE",
            headers: {
            "Authorization": "Bearer "+cookies.get("access_token"),
            "Content-Type": "application/json"
            }
        }).then(res=>{
            console.log(res);
            if(res.status==204){
                // this.props.setNeedReload(id);
                window.location.reload();
            }
        })
        }
    }




export default function NotificationsPage(){

    const {restaurantOwner,setRestaurantOwner,token,setNotifications_count} = React.useContext(APIContext);
    const [notifications,setNotifications] = useState([]);
    const [need_reload,setNeedReload] = useState(false);
    const [nexturl,setNexturl] = useState("");
    const [notificationsui,setNotificationsui] = useState([]);
    const [load_count,setLoad_count] = useState(0);

    useEffect(()=>{
        setNotificationsui([]);
        if (notifications){
            notifications.map((notification)=>{
                console.log(notification)
                setNotificationsui(old => [...old,<NotificationComponents key={notification.id} id={notification.id} type={notification.type} content={notification.content} setNeedReload={setNeedReload} />])
            })
            console.log("new_ui",notificationsui);
        }
        
    },[notifications])


    useEffect(()=>{
        if (!token){
            return;
        }
        if(nexturl===null){
            return;
        }

        fetch(nexturl=== "" ?config.baseurl+"/user/notifications/?limit=10":nexturl ,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            }
        })
        .then(res => res.json())
        .then(res => {
            setNotifications_count(res.count);
            setNotifications(old => [...old,...res.results]);
            setNexturl(res.next);
        })
    },[token,need_reload,load_count])

    return (
        <>
        <div className="container-xl px-4 mt-5">

            <div className="list-group" style={{
                width: "90%",
                margin: "auto"
            }}>
                {notificationsui}
                {
                    nexturl===null ? null:<Button
                    onClick={()=>{
                        setLoad_count(load_count+1);
                    }}
                    >Load More</Button>
                }
            </div>
        </div>

        </>
    );


}