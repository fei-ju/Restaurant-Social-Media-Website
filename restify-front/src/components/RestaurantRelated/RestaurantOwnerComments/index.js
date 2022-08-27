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


/*

    comment = {
        id: 1,
        icon:"",
        comments_by: "name",
        comments_time: "time",
        content:"content",
        reply : {
            id: 1,
            content:"content",
            reply_time: "time",
        }
    }

*/
class Comments_Component extends React.Component {

    render() {
        const { comment, setboxtitle, setboxcontent1, setboxcontent2, setcomment_id } = this.props;

        return <>
            <div className="col-md-9" >
                <div className="card p-4 mt-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="user d-flex flex-row align-items-center">
                            <img src={comment.icon} width="30" className="user-img rounded-circle mr-2" />
                            <span><small className="font-weight-bold text-primary" style={{
                                marginLeft: "5px"
                            }}>{comment.comments_by}</small>
                                <small className="fw-bold" style={{
                                    marginLeft: "10px"
                                }}>{comment.content}</small>
                            </span>
                        </div>
                        <small>{comment.comments_time}</small>
                    </div>
                    <div className="action d-flex justify-content-between mt-2 align-items-center">
                        <div className="reply px-4" style={{
                            marginLeft: "20px",
                            marginTop: "10px"
                        }}> </div>
                        <div className="icons align-items-center"> <i className="fa fa-check-circle-o check-icon text-primary"></i> </div>
                    </div>
                    {/* {console.log("comment.reply",comment.reply)} */}
                    {comment.reply.id ? <div style={{
                        marginLeft: "30px",
                        marginTop: "5px",
                        borderLeft: "1px solid grey"
                    }}>
                        <p style={{
                            marginLeft: "10px",
                            marginTop: "5px",
                            color: "darkblue"
                        }}>Owner's Reply</p>
                        <p style={{
                            marginLeft: "30px"
                        }}>{comment.reply.content}</p>

                    </div>
                        : <>
                            <div className="action d-flex justify-content-between mt-2 align-items-center">
                                <div className="reply px-4" style={{
                                    marginLeft: "20px",
                                    marginTop: "10px"
                                }}> <Button variant="contained" data-bs-toggle="modal" data-bs-target="#exampleModal" className="comments-btn"
                                    onClick={() => {
                                        setboxtitle("Reply");
                                        setboxcontent1(comment.comments_by + " : " + comment.content);
                                        setboxcontent2("");
                                        setcomment_id(comment.id);
                                    }}

                                >Reply</Button>
                                    <div className="icons align-items-center"> <i className="fa fa-check-circle-o check-icon text-primary"></i>
                                    </div></div></div>
                        </>
                    }


                </div>

            </div>
        </>
    }


}
export default function RestaurantOwnerComments() {

    const comment = {
        id: 1,
        icon: "https://i.imgur.com/HNWMaIvb.jpg",
        comments_by: "name",
        comments_time: "time",
        content: "content",
        reply: {
            id: 1,
            content: "reply content",
            reply_time: "time",
            "icon": "",
        }
    }
    comment.reply = {}
    const [boxtitle, setboxtitle] = useState("");
    const [boxcontent1, setboxcontent1] = useState("");
    const [boxcontent2, setboxcontent2] = useState("");
    const [comment_id, setcomment_id] = useState("");
    const { userData, setuserData, restaurantOwner, token } = React.useContext(APIContext);
    const [comments, setcomments] = useState([]);
    const [my_all_comments, setMy_all_comments] = useState([]);
    const [nexturl, setnexturl] = useState("");
    const [load_count, setload_count] = useState(0);

    useEffect(() => {
        if (!restaurantOwner || !restaurantOwner.id) {
            return;
        }
        if(nexturl===null){
            return;
        }

        const all_comments = [];
        // fetch comments from server
        fetch(nexturl===""?config.baseurl + "/post_comments/all_comments/" + restaurantOwner.id + "/?limit=5":nexturl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }).then(res => res.json())

            .then(res => {
                res.results.map(comment => {
                    comment.comments_by = "Annonymous User";
                    comment.icon = "https://i.imgur.com/HNWMaIvb.jpg";
                    comment.reply = {};
                    all_comments.push(comment);
                    setMy_all_comments( old => [...old, comment]);
                    setnexturl(res.next);

                    // check for reply
                    fetch(config.baseurl + "/restaurant_reply/get_reply/" + comment.id + "/", {

                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + token
                        }
                    }).then(res2 => res2.json())

                        .then(res2 => {
                            if (res2.count > 0) {
                                comment.reply = res2.results[0];
                                setMy_all_comments(old => [...old.map(c => {
                                    console.log("c.id", c.id, "comment.id", comment.id);
                                    if (c.id === comment.id) {
                                        c.reply = res2.results[0];
                                    }
                                    return c;
                                })]);
                            }
                            
                            
                        })

                })
            })
          
            
        
    }, [restaurantOwner,load_count])
    useEffect(() => {

        setcomments([]);
        console.log("my_all_comments", my_all_comments)
        my_all_comments.map(comment => {
            setcomments(old => [...old, <Comments_Component comment={comment} setboxtitle={setboxtitle} setboxcontent1={setboxcontent1} setboxcontent2={setboxcontent2} setcomment_id={setcomment_id} />])
        })
    }, [my_all_comments])



    return (<>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog  modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{boxtitle}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>

                            <input type="number" id="commentid" name="commentid" hidden />
                            <div className="mb-3">
                                <p>{boxcontent1}</p>
                                <div className="form-floating">
                                    <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{
                                        height: "100px"
                                    }} value={boxcontent2} onChange={(e) => { setboxcontent2(e.target.value) }}></textarea>
                                    <label >Reply</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" id="save_changes_btn2" data-bs-dismiss="modal"
                            onClick={() => {

                                console.log("add comment");

                                fetch(config.baseurl + "/restaurant_reply/replys/", {

                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": "Bearer " + new Cookies().get("access_token")
                                    },
                                    body: JSON.stringify({
                                        content: boxcontent2,
                                        reply_comment_to_id: comment_id
                                    })
                                })


                                    .then(res => {
                                        console.log(res);
                                        if (res.status === 201) {
                                            window.location.reload();
                                        }
                                    })
                            }
                            }
                        >Save</button>
                    </div>

                </div>
            </div>
        </div>



        <div className="container-xl px-4 mt-5">
            {comments}
            {comments.length !==0 ? "" : "No comments yet"}
            {nexturl===null ? null : <Button
            onClick={()=>{
                setload_count(old=>old+1);
            }}
            >Load More</Button>}
        </div>
    </>)


}