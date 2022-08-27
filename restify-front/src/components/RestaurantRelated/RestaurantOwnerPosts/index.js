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

class Post_Component extends React.Component {



    


    render(){

        const {post,setPost_title,setPost_content ,setPost_type,setPost_id} = this.props;

        return <>
        <tr>
            <td scope="row">{post.id}</td>
            <td width="50%">{post.post_title}</td>
            <td>{post.post_date}</td>
            <td>
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
                onClick={()=>{
                    setPost_title(post.post_title);
                    setPost_content(post.post_content);
                    setPost_type(1);
                    setPost_id(post.id);
                }
                }
                >Edit</button>
            </td>
            <td>
                <button className="btn btn-danger" onClick={()=>{
                    fetch(config.baseurl+"/post_actions/post/"+post.id+"/",{
                        method: "DELETE",
                        headers: {
                        "Authorization": "Bearer "+new Cookies().get("access_token"),
                        "Content-Type": "application/json"
                        }
                    }).then(res=>{
                        if(res.status===204){
                            // this.props.setNeedReload(post.id);
                            window.location.reload();
                        }
                    }
                    )
                }}
                >Delete</button>
            </td>
        </tr>
        </>
    }
}



export default function RestaurantOwnerPosts(){
    const post = {
        id: 1,
        post_title: "Post 1",
        post_content: "Post 1 content",
        post_date: "2020-01-01"
    }
    const {restaurantOwner} = React.useContext(APIContext);
    const [post_title, setPost_title] = useState("");
    const [post_content, setPost_content] = useState("");
    const [post_id, setPost_id] = useState(-1);
    const [post_type, setPost_type] = useState(0);
    const [posts, setPosts] = useState([]);
    const [needReload, setNeedReload] = useState(false);
    const [posts_ui, setPosts_ui] = useState([]);
    const [nexturl, setNexturl] = useState("");
    const [load_count, setLoad_count] = useState(0);


    useEffect(()=>{
        

        if(restaurantOwner && restaurantOwner.id){

            if (nexturl===null){
                return;
            }
            fetch(nexturl ==="" ? config.baseurl+"/post_actions/restaurant/all_post/"+restaurantOwner.id+"/":nexturl,{
                method: "GET",
                headers: {
                    "Authorization": "Bearer "+new Cookies().get("access_token"),
                    "Content-Type": "application/json"
                }
            }).then(res=>{
                if(res.status===200){
                    res.json().then(data=>{
                        setNexturl(data.next);
                        setPosts(old => [...old, ...data.results]);
                    })
                }
                
            })
        }

    },[restaurantOwner,needReload,load_count])

    useEffect(()=>{
        setPosts_ui([]);
        posts.map(post=>{
            setPosts_ui(old => [...old,<Post_Component post={post} setPost_title={setPost_title} setPost_content={setPost_content} setPost_type={setPost_type} setPost_id={setPost_id} key={post.id} setNeedReload={setNeedReload}/>])
        })

    },[posts])


    return (<>
    <div className="container-xl px-4 mt-4" style={{
        padding: "10px",
        border: "1px solid #e5e5e5",
        borderRadius: "5px",
        backgroundColor: "#f5f5f5",
    }}>




    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog  modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel2">Edit Post</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form>

                        <input type="number" id="postid" name="postid" value={post_id} onChange={(e)=>{setPost_id(e.target.value)}} hidden/>
                        <div className="mb-3">
                            <label className="form-label" >Post Title</label>
                            <input type="text" className="form-control" id="item_name2"
                                   value={post_title} onChange={(e)=>{setPost_title(e.target.value)}} />
                        </div>
                        <textarea id="mytextarea" name="mytextarea" style={{
                            width: "100%",
                            height: "500px"
                        }} value = {post_content} onChange={(e)=>{setPost_content(e.target.value)}}></textarea>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" id="save_changes_btn2" data-bs-dismiss="modal"
                    onClick={
                        ()=>{
                        if (post_type===0){
                            // new post
                            fetch(config.baseurl+"/post_actions/post/",{
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer "+new Cookies().get("access_token")
                                },
                                body: JSON.stringify({
                                    post_title: post_title,
                                    post_content: post_content,
                                })
                            }).then(res=>res.json()).then(data=>{
                                console.log(data);
                                // setNeedReload(true);
                                if (data.id){
                                    alert("Post created successfully");
                                }else{
                                    alert("Error creating post,Check if you have entered all the fields");
                                }
                                
                                window.location.reload();

                            })
                        }else{
                            // edit post
                            fetch(config.baseurl+"/post_actions/post/"+post_id+"/",{
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer "+new Cookies().get("access_token")
                                },
                                body: JSON.stringify({
                                    post_title: post_title,
                                    post_content: post_content,
                                })
                            }).then(res=>res.json()).then(data=>{
                                console.log(data);
                                // setNeedReload(old=>!old);
                                if (data.id){
                                    alert("Post edit successfully");
                                }else{
                                    alert("Error edit post,Check if you have entered all the fields");
                                }                                
                                window.location.reload();
                            })
                        }
                    }}
                    >Save</button>
                </div>

            </div>
        </div>
    </div>


    <div align="right" style={{
        marginRight: "50px"
    }}>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={
            ()=>{
                setPost_content("");
                setPost_title("");
                setPost_id(null);
            }
        }>New Post</button>

    </div>

    <table className="table  table-hover" >
        <thead>
        <tr >
            <th scope="col">PostId</th>
            <th scope="col">Title</th>
            <th scope="col">Created</th>
            <th scope="col"></th>
            <th scope="col"></th>

        </tr>
        </thead>
        <tbody>
            {posts_ui}
            
        </tbody>
        
    </table>
    {nexturl===null ? null:
            <Button
            onClick={()=>{
                setLoad_count(old=>old+1);
            }}
            >Load More</Button>}
</div>

    </>);

}