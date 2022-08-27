import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import { APIContext } from '../../Contexts/APIContext';
import config from "../../config.json";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ClassNames } from '@emotion/react';
import Cookies from 'universal-cookie';


class PostCard extends React.Component{

    render(){
        
        const { post } = this.props;

        return <>
        <Card style={{
            marginTop: "20px",
            width: "40%",
        }}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={post.logo}>
                                    R
                                </Avatar>
                            }
                            title={post.name+" : "+post.post_title}
                            subheader={post.post_date}
                        />
                        

                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {post.post_content.substring(0, 100) }
                                {post.post_content.length > 100 ? '...' : ''}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                                href={"/post/"+post.id+"/"}
                            >
                                View Post
                            </Button>
                        </CardActions>
                    </Card>
        </>
    }
}


const theme = createTheme();
const Style = {
    height: 300,
    width: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

export default function UserFeed() {
    
    // Feed page
    const [posts, setPosts] = useState([]);
    const [workingon, setWorkingon] = useState([]);
    const [posts_ui, setPosts_ui] = useState([]);
    const [nexturl, setNexturl] = useState("");
    const [load_count, setLoad_count] = useState(0);

    // get all the feed posts
    useEffect(() => {

        const token = new Cookies().get('access_token');
        
        if (nexturl=== null){
            return;
        }


        fetch(nexturl=== "" ? `${config.baseurl}/restaurant_general/feed/?limit=10` : nexturl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            // sort data.results by id
            data.results.sort((a, b) => (a.id > b.id) ? 1 : -1);

            setNexturl(data.next);

            // console.log("response",data);
            const all_restaurants = [];
            data.results.map(post => {
                // if (post.owned in all_restaurants) {
                if (all_restaurants.includes(post.owned)) {
                    return;
                }
                all_restaurants.push(post.owned);
            });

            setPosts(old_posts => [...old_posts, ...data.results]);
            all_restaurants.map(restaurant_id => {
                    fetch(`${config.baseurl}/restaurant_general/restaurant_info/${restaurant_id}/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json()).then(data => {
                        // set the logo in the setPosts

                        setPosts(posts => [...posts.map( p => {
                            if(p.owned === restaurant_id){
                                // console.log(p,restaurant_id,"1")
                                p.logo = data.logo;
                                p.name = data.name;
                            }
                            return p;
                        }
                        )]);
                    }
                    );
                

            });

        });

    }, [load_count]);

    // load all the posts to the ui list
    useEffect(() => {
        console.log("posts",posts);
        setPosts_ui([]);
        posts.map(post => {
            setPosts_ui(posts_ui => [...posts_ui, <PostCard post={post} key={post.id} />]);
        });
    }, [posts]);

    // Cards inspired from https://mui.com/material-ui/react-card/#media
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="1">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >

                    <Typography component="h1" variant="h5">
                        My Feed
                    </Typography>

                    {posts_ui}
                    {nexturl ===null ? null: <Button
                    onClick={() => {
                        setLoad_count(load_count + 1);

                    }}
                    >Load More</Button>}
                </Box>
            </Container>
        </ThemeProvider>
    );
}