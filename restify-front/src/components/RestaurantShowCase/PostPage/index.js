
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
import {useParams} from 'react-router-dom';

export default function PostPage(){
    const {post_id} = useParams();

    const [post_check,setPost_check] = useState(false);
    const [liked,setLiked] = useState(false);
    const [post,setPost] = useState({
        id: post_id,
        post_title: "",
        post_content: "",
        post_like: 0,
        post_date: "",
        post_owned_by: 0,
        post_owned_by_name: "",
    });

    useEffect(()=>{
        fetch(config.baseurl+"/post_actions/post/get/"+post_id+ "/",{
            method: "GET",

        }).then(res=>{
            if (res.status!==200){
                console.log("Error");
                console.log(res);
                alert("Blog not found, check if you are logged in");
                window.location.href = "/";
            }
            res.json().then(data=>{
                setPost(old=> {
                    return {
                        ...old,
                        post_title: data.post_title,
                        post_content: data.post_content,
                        post_date: data.post_date,
                        post_owned_by: data.owned,
                    }
                });
                setPost_check(true);
            });
        }
        )
    },[]);
    useEffect(()=>{

        if (post.post_owned_by===0){
            return;
        }
        fetch(config.baseurl + "/post_like/all_like/"+post_id+"/",{
        }).then (res=>res.json()).then(data=>{
            if (data.count){
                setPost(old=>{
                    return {
                        ...old,
                        post_like: data.count
                    }
                });
                
            }
        });
        // get restaurant name from restaurant id
        fetch(config.baseurl + "/restaurant_general/information/"+post.post_owned_by+"/",{
            method: "GET",
            headers: {
                "Authorization": "Bearer "+new Cookies().get("access_token"),
                "Content-Type": "application/json"}
        }).then (res=>res.json()).then(data=>{
            if (data.name){
                setPost(old=>{
                    return {
                        ...old,
                        post_owned_by_name: data.name
                    }
                });
                
            }
        });
    },[post_check]);



        




    return (<>
        <div className="container mt-5">
            <div className="row d-flex justify-content-center">
                <div className="col-lg-10">
                    <article>
                        <header className="mb-4">
                            <h1 className="fw-bolder mb-1">{post.post_title}</h1>
                            <div className="text-muted fst-italic mb-2">Posted on {post.post_date} by {post.post_owned_by_name}</div>
                            <small style={{
                                color: "red"
                            }}> &#10084;&#65039; <b>{post.post_like} Likes</b></small> 
                        </header>

                        <section className="mb-5">
                            <p>{post.post_content}</p>
                        </section>
                    </article>

                    <div className="container d-flex justify-content-center">
                        <button className="btn btn-block btn-danger mb-5"
                        onClick={()=>{
                            if (liked){
                                return;
                            }

                            fetch(config.baseurl+"/post_like/mylike/",{
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization":"Bearer "+new Cookies().get("access_token")
                                },
                                body: JSON.stringify({
                                    like_post_to_id:post_id})
                            }).then(res=>{
                                if (res.status===201){
                                    setPost(old=>{
                                        return {
                                            ...old,
                                            post_like: old.post_like+1
                                        }
                                    });
                                }
                                setLiked(true);
                            })
                        }}
                        >Like this post</button>
                    </div>
                </div>
            </div>
        </div></>);
}