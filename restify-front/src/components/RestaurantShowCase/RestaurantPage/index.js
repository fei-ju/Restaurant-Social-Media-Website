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
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { getFCP } from 'web-vitals';


class MenuComponent extends React.Component {

    render() {
        const { menu } = this.props;

        return <>
            <li className="list-group-item d-flex justify-content-between align-items-center">
                <b>{menu.name}</b>
                <span style={{
                    width: "70%"
                }}>{menu.description}</span>
                <span>$ {menu.price}</span>
            </li>
        </>
    }
}

class PostComponent extends React.Component {

    render() {
        const { post } = this.props;
        return <>
            <div className="card mt-2">
                <div className="card-header">
                    {post.post_date}
                </div>
                <div className="card-body">
                    <h5 className="card-title">{post.post_title}</h5>
                    <p className="card-text">{post.post_content.substring(0, 100) + "....."}</p>
                    <a href={"/post/" + post.id + "/"} className="btn btn-primary">View Post</a>
                </div>
            </div>
        </>
    }

}


class CommentComponent extends React.Component {

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

    render() {

        const { comment } = this.props;


        return <>

            <div className="d-flex mb-4">
                <div className="flex-shrink-0"><img className="rounded-circle"
                    src="https://i.imgur.com/HNWMaIvb.jpg" width="30" alt="..." /></div>
                <div style={{
                    marginLeft: "20px"
                }}>
                    <div className="fw-bold">Annonymous User</div>
                    <p>{comment.content}</p>
                </div>
            </div>
            {comment.reply.id ?
                <div style={{
                    marginLeft: "80px"
                }}>
                    <div className="fw-bold">Owner's Reply</div>
                    <p>{comment.reply.content}</p>
                </div>
                : null}
            <hr />

        </>
    }
}


function follow(restaurant_id, setFollow_id) {
    const token = new Cookies().get("access_token");
    fetch(config.baseurl + "/restaurant_follow/follow/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            follow_to_id: restaurant_id
        })
    }).then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.id) {
                setFollow_id(res.id);
            }
        }
        )
}

function Unfollow(follow_id, setFollow_id) {
    const token = new Cookies().get("access_token");
    fetch(config.baseurl + "/restaurant_follow/follow/" + follow_id + "/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }).then(res => {
        if (res.status === 204) {
            setFollow_id(null);
        }
    })
}

function like(restaurant_id,setLike_id) {
    const token = new Cookies().get("access_token");
    fetch(config.baseurl + "/restaurant_like/mylike/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            like_restaurant_to_id: restaurant_id
        })
    }).then(res => res.json())
        .then(res => {
            console.log(res);
            if (res.id) {
                setLike_id(res.id);
            }
        }
        )
}


function unLike(like_id,setLike_id) {

    const token = new Cookies().get("access_token");
    fetch(config.baseurl + "/restaurant_like/mylike/" + like_id + "/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }).then(res => {
        if (res.status === 204) {
            setLike_id(null);
        }
    })
}


export default function RestaurantPage() {
    const { restaurant_id } = useParams();
    const [restaurant, setRestaurant] = React.useState({});
    const [images, setImages] = React.useState([]);
    const { userData, setuserData, token } = React.useContext(APIContext);
    const [comments, setcomments] = useState([]);
    const [my_all_comments, setMy_all_comments] = useState([]);
    const [posts, setPosts] = React.useState([]);
    const [menu, setMenu] = React.useState([]);
    const [check_exist, setCheck_exist] = React.useState(false);
    const [follow_id, setFollow_id] = React.useState(null);
    const [like_id, setLike_id] = React.useState(null);
    const [comment_content, setComment_content] = React.useState("");
    const [comments_reload, setComments_reload] = React.useState(false);

    const [comment_next_url, setComment_next_url] = React.useState("");
    const [comment_load_counter, setComment_load_counter] = React.useState(0);

    useEffect(() => {
        if (!check_exist) {
            return;
        }
        // setMy_all_comments([]);

        const all_comments = [];
        // fetch comments from server
        fetch(comment_next_url==="" ? config.baseurl + "/post_comments/all_comments/" + restaurant_id + "/?limit=3":comment_next_url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => res.json())

            .then(res => {
                setComment_next_url(res.next);

                res.results.map(comment => {
                    comment.comments_by = "Annonymous User";
                    comment.icon = "https://i.imgur.com/HNWMaIvb.jpg";
                    comment.reply = {};
                    all_comments.push(comment);
                    setMy_all_comments(old => [...old, comment]);

                    // check for reply
                    fetch(config.baseurl + "/restaurant_reply/get_reply/" + comment.id + "/", {

                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }).then(res2 => res2.json())

                        .then(res2 => {
                            if (res2.count > 0) {
                                comment.reply = res2.results[0];
                                setMy_all_comments(old => [...old.map(c => {
                                    // console.log("c.id", c.id, "comment.id", comment.id);
                                    if (c.id === comment.id) {
                                        c.reply = res2.results[0];
                                    }
                                    return c;
                                })]);
                            }
                        })

                })
            })
    }, [ check_exist,comment_load_counter])
    useEffect(() => {

        setcomments([]);
        // console.log("my_all_comments", my_all_comments)
        my_all_comments.map(comment => {
            setcomments(old => [...old, <CommentComponent comment={comment} key={comment.id} />])
        })
    }, [my_all_comments])

    useEffect(() => {
        fetch(config.baseurl + "/restaurant_general/restaurant_info/" + restaurant_id + "/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }

        }).then(res => res.json()).then(res => {
            if (res.id) {
                setRestaurant(res);
                setCheck_exist(true);
            }
        })
    }, [restaurant_id])

    const [menu_nexturl, setMenu_nexturl] = React.useState("");

    useEffect(() => {
        if (!check_exist) {
            return;
        }
        // get all menus
        if (menu_nexturl===null) {
            return ;    
        }

        fetch(menu_nexturl==="" ? config.baseurl + "/restaurant_menu/all_menu/" + restaurant_id + "/" : menu_nexturl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }

        }).then(res => res.json()).then(res => {
            if (res.count > 0) {
                setMenu(old => [...old,res.results.map(menu => {
                    return <MenuComponent menu={menu} key={menu.id} />
                })])
            }
            setMenu_nexturl(res.next);
        })
    }, [check_exist,menu_nexturl])


    const [posts_nexturl, setPosts_nexturl] = React.useState("");
    const [post_counter, setPost_counter] = React.useState(0);

    useEffect(() => {
        if (!check_exist) {
            return;
        }
        if (posts_nexturl===null) {return}
        // get all posts
        fetch(posts_nexturl==="" ? config.baseurl + "/post_actions/restaurant/all_post/" + restaurant_id + "/?limit=3" : posts_nexturl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }
        ).then(res => res.json()).then(res => {
            if (res.count > 0) {
                setPosts(old => [...old, res.results.map(post => {
                    return <PostComponent post={post} key={post.id} />
                })])
            }
            setPosts_nexturl(res.next);
        })


    }, [check_exist,post_counter])


    const [picture_nexturl, setPicture_nexturl] = React.useState("");

    useEffect(() => {
        if (!check_exist) {
            return;
        }

        if (picture_nexturl===null) {
            return;
        }
        // setImages([]);
        // get all restaurant images
        fetch(picture_nexturl ==="" ? config.baseurl + "/restaurant_picture/all_picture/" + restaurant_id + "/" : picture_nexturl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }
        ).then(res => res.json()).then(res => {
            if (res.count > 0) {
                setImages(old => [...old,res.results.map(image => {
                    return <div key={image.id} style={{
                        height: "600px",
                        width: "800px",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "auto",
                    }}>
                        <img src={image.restaurant_picture} alt="" />
                    </div>
                })])
            }
            setPicture_nexturl(res.next);
        })


    }, [check_exist,picture_nexturl])



    useEffect(() => {
        // check if user is following this restaurant
        if (!check_exist) {
            return;
        }
        fetch(config.baseurl + "/restaurant_follow/is_following/" + restaurant_id + "/", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + new Cookies().get("access_token")
            }

        }).then(res => res.json())
            .then(res => {
                if (res.id) {
                    setFollow_id(res.id);
                }
            })

        fetch(config.baseurl + "/restaurant_like/check/" + restaurant_id + "/", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + new Cookies().get("access_token")
            }
        }).then(res => res.json())

            .then(res => {
                if (res.id) {
                    setLike_id(res.id);
                }
            }
            )



    }, [check_exist])




    return <>

        <div className="card-header" align="center">
            <h1> {restaurant.name} General Info </h1>
        </div>

        <Carousel>
            {images}
        </Carousel>



        <div className="container mt-2 d-flex justify-content-center">
            <div className="col-xl-12">
                <div className="card" align="center">
                    <div className="card-body">
                        <div className="row" style={{
                            width: "80%"
                        }}>
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Followers</h5>
                                        <p className="card-text">{restaurant.follower_count}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Likes</h5>
                                        <p className="card-text">{restaurant.like_count}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Comments</h5>
                                        <p className="card-text">{restaurant.comment_count}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {


                            new Cookies().get("access_token") ? <div className="container d-flex justify-content-center">
                                {follow_id ? <button className="btn btn-danger mt-3 ms-3" onClick={() => { Unfollow(follow_id, setFollow_id);restaurant.follower_count-=1 }}>Unfollow</button> : <button className="btn btn-warning mt-3 ms-3" onClick={() => { follow(restaurant_id, setFollow_id);restaurant.follower_count+=1 }}>Follow</button>}
                                {like_id ? <button className="btn btn-danger mt-3 ms-3" onClick={() => { unLike(like_id,setLike_id );restaurant.like_count-=1 }}>UnLike</button> : <button className="btn btn-warning mt-3 ms-3" onClick={() => { like(restaurant_id,setLike_id );restaurant.like_count+=1}}>Like</button>}
                            </div> : null
                        }

                    </div>
                </div>

                <div className="container d-flex justify-content-center mt-3">
                    <h2> Menu </h2>
                </div>
                {/* <!-- Menu items--> */}
                <div className="container d-flex justify-content-center" >
                    <div className="text-center" style={{
                        width: "100%"
                    }}>
                        <div className="card-body" >
                            <ul className="list-group">
                                {menu}
                            </ul>
                        </div>
                    </div>

                </div>


                {/* posts */}
                <div className="container mt-3 d-flex justify-content-center">
                    <h2> Blog Posts </h2>
                </div>

                <div className="col-mt-1">
                    {/* <!-- Cards taken from https://getbootstrap.com/docs/4.3/components/card/--> */}
                    {posts}
                    {posts_nexturl===null ? null : <Button
                    onClick={() => {
                        
                        setPost_counter(post_counter+1);
                    }
                    }
                    >Load More</Button>}
                </div>


                {/* comments */}

                <section className="mb-5">
                    <h3 align="center"> Comments</h3>
                    <div className="card bg-light">
                        <div className="card-body">
                            {new Cookies().get("access_token") ? <form className="mb-4"><textarea className="form-control" rows="3"
                                placeholder="Write your comments here" 
                                value={comment_content}
                                onChange={(e) => { setComment_content(e.target.value) }}
                                ></textarea>
                                <Button variant="contained" style={{
                                    marginTop: "10px"
                                }} 
                                onClick={() => {
                                    fetch(config.baseurl + "/post_comments/comments/", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": "Bearer " + new Cookies().get("access_token")
                                        }   ,
                                        body: JSON.stringify({
                                            "content":comment_content,
                                        "comment_restaurant_to_id":restaurant_id,
                                        })
                                    }).then(res => res.json())
                                        .then(res => {
                                            if (res.id){
                                                restaurant.comment_count+=1;
                                                // setComments_reload(!comments_reload);
                                                window.location.reload();
                                                setComment_content("");
                                            }
                                        })
                                    }
                                }>
                                Submit</Button>
                                </form> : null}
                            {comments}
                            {comment_next_url===null ? null : <Button
                            onClick={() => {
                                setComment_load_counter(comment_load_counter+1);
                            }
                            }
                            >Load More</Button>}
                        </div>
                    </div>
                </section>


            </div>
        </div>
    </>
}