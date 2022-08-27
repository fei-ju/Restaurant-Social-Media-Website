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




class Photo_Column extends React.Component{
    
    render (){
        const {id,url,setNeed_reload} = this.props
        return <>
        <tr>
                                        <th scope="row" style={{
                                            textAlign:"center"
                                        }}>{id}</th>
                                        <td width="70%" ><img src={url} width="200px" height="200px" /></td>
                                        <td width="25%" >
                                            <div>
                                                <div className="form-check form-switch form-check" style={{
                                                    marginTop:"50px"
                                                }}>
                                                    
                                                </div>
                                                <button className="btn-danger btn-sm " style={{
                                                    marginTop:"10px",
                                                    marginLeft:"70px"
                                                }} onClick={this.deletephoto} photoid={id} >Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                    </>

    }

    deletephoto = () =>{
        console.log(this.props.id);
        const cookies = new Cookies();

        fetch(config.baseurl+"/restaurant_picture/picture/"+this.props.id+"/",{
            method:"DELETE",
            headers:{
                "Authorization":"Bearer "+ cookies.get("access_token")
            }
        })
        .then(res=>{
            if (res.status===204){
                console.log("deleted");
                // refresh the page
                window.location.reload();
                
            }
        })
}}

export default function MyRestaurant(){

    const {restaurantOwner,setRestaurantOwner,token} = React.useContext(APIContext);
    const [restaurantimages,setRestaurantimages] = useState([]);
    const [need_reload,setNeed_reload] = useState(false);


    const [restaurantName,setRestaurantName] = useState("");
    const [restaurantAddress,setRestaurantAddress] = useState("");
    const [restaurantPostalCode,setRestaurantPostalCode] = useState("");
    const [restaurantPhone,setRestaurantPhone] = useState("");
    const [nexturl,setNexturl] = useState("");
    


    useEffect(() => {
        console.log("MyRestaurant: useEffect",restaurantOwner);
        if (restaurantOwner){
            setRestaurantName(restaurantOwner.name);
            setRestaurantAddress(restaurantOwner.address);
            setRestaurantPostalCode(restaurantOwner.postal_code);
            setRestaurantPhone(restaurantOwner.phone);
        }
    }, [restaurantOwner])

    useEffect(() => {
        

        if (restaurantOwner && restaurantOwner.id){
            var url = nexturl;
            if (nexturl===""){
                url = config.baseurl+"/restaurant_picture/all_picture/"+restaurantOwner.id+"/"
            }
            if (url===null){
                return;
            }
            // setRestaurantimages([])
            fetch(url,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log("MyRestaurant: useEffect",data);
                data.results.map(item => {
                    console.log(item);
                    setRestaurantimages(oldArray => [...oldArray,<Photo_Column id={item.id} url={item.restaurant_picture} key={item.id} setNeed_reload={setNeed_reload}/>])
                    setNexturl(data.next);
                })
            })
        }
        
    }, [restaurantOwner,need_reload])
    
    
    


    return (
        <>
            <div className="container-xl px-4 mt-4">

                <div className="row">
                    <div className="col-xl-3">
                        <div className="card" style={
                        {
                            width:"18rem",
                        }
                    } align="center">
                            <div className="card-header" >Current Information</div>
                            <img align="center" src={restaurantOwner ? restaurantOwner.logo : ""} className="card-img-top" style={{
                                width:"200px",
                                height:"200px",
                                margin:"auto",
                                marginTop:"10px",
                                // center the image
                                align:"center"
                                
                            }}/>
                            <div className="card-body">
                                <label className="btn btn-primary">
                                    Upload new logo <input type="file" id="logo_file" hidden 
                                    onClick={(e)=>{
                                        e.target.value = null;
                                    }
                                    }
                                    onChange={(e)=>{
                                        const cookies = new Cookies();
                                        const formData = new FormData();
                                        formData.append("logo",e.target.files[0]);
                                        fetch(config.baseurl+"/restaurant_general/information/"+restaurantOwner.id+"/",{
                                            method:"PATCH",
                                            headers:{
                                                "Authorization":"Bearer "+ cookies.get("access_token")
                                            },
                                            body:formData
                                        })
                                        .then(res => res.json())
                                        .then(
                                            res=>{
                                            if (res.id){
                                                console.log("updated logo");
                                                console.log(res);
                                                setRestaurantOwner(res);
                                            }
                                        })}
                                    }

                                    />
                                </label>

                            </div>
                        </div>
                    </div>
                    <div className="col-xl-9">
                        <div className="card"  align="center">
                            <div className="card-header" align="center">Restaurant General Info</div>
                            <div className="card-body">
                                <p>Welcome back <b>{restaurantOwner ? restaurantOwner.name : null}</b>.</p>

                                <div className="row" style={
                        {
                            width:"80%"
                        }
                    }>
                                    <div className="col-sm-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">Follower</h5>
                                                <p className="card-text">{restaurantOwner ? restaurantOwner.follower_count : null}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">Likes</h5>
                                                <p className="card-text">{restaurantOwner ? restaurantOwner.like_count : null}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>

                                <br/>
                                <div className="row" style={
                        {
                            width:"80%"
                        }
                    }>
                                    <div className="col-sm-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">Blog Posts</h5>
                                                <p className="card-text">{restaurantOwner ? restaurantOwner.post_count : null}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">Comments</h5>
                                                <p className="card-text">{restaurantOwner ? restaurantOwner.comment_count : null}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>


                            </div>
                        </div>
                        <br/>
                    <div className="card"  align="center">
                        <div className="card-header" align="center">Profile Details</div>
                        <div className="card-body" >
                        <div style = {{
                            width:"90%",
                            textAlign:"center"
                        }} >
                            <div className="mb-3">
                                <label className="form-label" >Restaurant Name</label>
                                <input type="text"  className="form-control" id="restaurant_name" value={restaurantName} onChange={(e)=>{ setRestaurantName(e.target.value)}}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label" >Address</label>
                                <input type="text"  className="form-control" id="restaurant_address" value={restaurantAddress} onChange={(e)=>{ setRestaurantAddress(e.target.value)}}/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label" >Postcode</label>
                                <input type="text"  className="form-control" id="restaurant_postcode" pattern="[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]" maxLength="7" value={restaurantPostalCode} onChange={(e)=>{ setRestaurantPostalCode(e.target.value)}}/>

                            </div>
                            <div className="mb-3">
                                <label className="form-label" >Phone Number</label>
                                <input type="text" pattern="\d*" maxLength="10" className="form-control" id="phone" value={restaurantPhone} onChange={(e)=>{ setRestaurantPhone(e.target.value)}}/>
                            </div>


                            <button className="btn-primary btn" 
                            onClick={(e)=>{
                                const cookies = new Cookies();
                                const data = new FormData();
                                data.append("name",restaurantName);
                                data.append("address",restaurantAddress);
                                data.append("postal_code",restaurantPostalCode);
                                data.append("phone",restaurantPhone);
                                data.append("id",restaurantOwner.id);
                                console.log(data);


                              fetch(config.baseurl+"/restaurant_general/information/"+restaurantOwner.id+"/", {
                                  method:"PATCH",
                                  headers:{
                                      "Authorization":"Bearer "+ cookies.get("access_token")
                                  },
                                  body:data
                              }).then(res=>res.json()).then(res=>{
                                  if(res.id){
                                        setRestaurantOwner(res);

                                  }
                              })  
                            }}
                            >Save</button>
                        </div>

                    </div>
                </div>


                        <br/>
                        <div className="card"  align="center">
                            <div className="card-header" align="center">Restaurant Photos</div>
                            <div className="card-body" >
                                <table className="table table-hover center-table" style={{
                                    width:"80%"
                                }}>
                                    <thead>
                                    <tr align="center">
                                        <th scope="col">#</th>
                                        <th scope="col" >Photo</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    
                                    {restaurantimages}
                                    </tbody>
                                </table>
                                {nexturl===null ? null : <Button
                                onClick={(e)=>{
                                    setNeed_reload(!need_reload);
                                }}
                                >Load More</Button>}
                                <br/>

                                <label className="btn btn-primary">
                                    Add new photo <input type="file" id="new_restaurant_photo" hidden 
                                    onClick={(e)=>{
                                        e.target.value = null
                                    }
                                    }

                                    onChange={(e)=>{
                                        
                                        let files = e.target.files;
                                        const data = new FormData();
                                        data.append('restaurant_picture', files[0]);

                                        fetch(config.baseurl+"/restaurant_picture/picture/",{
                                            method:"POST",
                                            body:data,
                                            headers:{
                                                'Authorization':'Bearer '+token
                                            }
                                        })
                                        .then(res=>res.json())
                                        .then(data=>{
                                                setRestaurantOwner({...restaurantOwner,restaurant_picture:data.restaurant_picture})
                                                window.location.reload();
                                        }
                                        )
                                    }}/>
                                </label>
                            </div>
                        </div>
                    </div>

                    </div>
            </div>
        </>
    );
}