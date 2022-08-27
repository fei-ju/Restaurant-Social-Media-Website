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

export default function RestaurantOwnerMenu (){


    const [menus,setMenus] = useState([]);

    const [current_selected_menu,setCurrentSelectedMenu] = useState(null);

    const [menu_render_lists,setMenuRenderLists] = useState([]);

    const {restaurantOwner,setRestaurantOwner,token} = React.useContext(APIContext);
    const [nexturl,setNextUrl] = useState("");

    // const [need_update ,setNeedUpdate] = useState(false);




    useEffect(()=>{
        const ids = [];
        if (!token || !restaurantOwner){
            return;
        }
        if (nexturl===""){
            setNextUrl(config.baseurl+"/restaurant_menu/all_menu/"+restaurantOwner.id+"/");
            return;
        }
        if(nexturl===null){
            return;
        }
            fetch(nexturl,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+token
                }
            })
            .then(res => res.json())
            .then(res => {
                setMenus([...menus,...res.results]);
                if (res.results.length > 0){
                    setCurrentSelectedMenu(res.results[0].id);
                }
                setNextUrl(res.next);
            })
        

        


    },[restaurantOwner,nexturl])


    useEffect(()=>{
        setMenuRenderLists([]);
        menus.map(item => {
            if (item.id === current_selected_menu){

            setMenuRenderLists(prev => [...prev,<a  className="list-group-item list-group-item-action active"  key={item.id} onClick={()=>{setCurrentSelectedMenu(item.id)}}>{item.name}</a>])
            setMenuName(item.name);
            setMenuDescription(item.description);
            setMenuPrice(item.price);

            }else{
                    setMenuRenderLists(prev => [...prev,<a  className="list-group-item list-group-item-action"  aria-current="true" key={item.id} onClick={()=>{setCurrentSelectedMenu(item.id)}}>{item.name}</a>])
                }
        })
    },[menus,current_selected_menu])





    const [menu_name,setMenuName] = useState("");
    const [menu_description,setMenuDescription] = useState("");
    const [menu_price,setMenuPrice] = useState("");




    return(
        <>
        
        <div className="container-xl px-4 mt-4">

        <div className="row">
        <div className="col-xl-3">
            <div className="card" style={{
                width: '18rem'
            }} align="center">
                <div className="card-header" align="center">My Menus</div>
                    <div className="list-group" style={{
                        marginTop: '10px',
                        marginLeft: '5px',
                        marginRight: '5px'
                    }}>
                        {/* <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
                            ✅ 10" Canadian Piazza
                        </a> */}
                        {menu_render_lists}
                        {/* <a href="#" className="list-group-item list-group-item-action">✅ 10" Hawaiian Pizza</a>
                        <a href="#" className="list-group-item list-group-item-action">🛑 Big Mac</a>
                        <a href="#" className="list-group-item list-group-item-action">✅ Double Cheese burger</a>
                        <a href="#" className="list-group-item list-group-item-action">🛑 Triple Cheese burger</a>
                        <a href="#" className="list-group-item list-group-item-action">✅ Quadruple Cheese burger</a>
                        <a href="#" className="list-group-item list-group-item-action">✅ Quintuple Cheese burger</a>
                        <a href="#" className="list-group-item list-group-item-action">✅ Vegetarian burger</a> */}
                    </div>
                    <div className="card-body">
                    <button className="btn-primary btn" style={{
                        marginTop: '10px'
                    }}
                    onClick={()=>{
                        setMenuName("");
                        setMenuDescription("");
                        setMenuPrice("");
                        setCurrentSelectedMenu(null);
                    }}
                    >Add new item</button>

                    </div>
            </div>
        </div>
        <div className="col-xl-9">
            <div className="card"  >
                <div className="card-header" align="center">Item Details</div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label" >Item Name</label>
                        <input type="text"  className="form-control" id="item_name" value={menu_name} onChange={(e)=>{setMenuName(e.target.value)}}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" >Item Price</label>
                        <input className="form-control" type="number" min="0.00" max="10000.00" step="0.01" id="item_price" value={menu_price} onChange={(e)=>{setMenuPrice(e.target.value)}}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" >Item Description</label>
                        <textarea className="form-control" id="item_description" rows="3"  value={menu_description} onChange={(e)=>{setMenuDescription(e.target.value)}}></textarea>
                    </div>
                    
                    <div align="center" style={{
                        marginTop: '10px'
                    }}>
                        <button className="btn-primary btn-lg btn text-center"  onClick={()=>{
                            if (!current_selected_menu){
                            const url = config.baseurl+"/restaurant_menu/";
                            fetch(url,{
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer "+token
                                },
                                body: JSON.stringify({
                                    name: menu_name,
                                    description: menu_description,
                                    price: menu_price,
                                    show_to_public: true,
                                })
                            })
                            .then(res => res.json())
                            .then(res => {
                                setMenus(prev => [...prev,res]);
                                setCurrentSelectedMenu(res.id);
                            })
                            }else{
                                console.log("PATCH")
                                const url = config.baseurl+"/restaurant_menu/"+current_selected_menu+"/";
                                fetch(url,{
                                    method:"PATCH",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": "Bearer "+token
                                    },
                                    body: JSON.stringify({
                                        name: menu_name,
                                        description: menu_description,
                                        price: menu_price,
                                        show_to_public: true,
                                    })
                                })
                                .then(res => res.json())
                                .then(res => {
                                    setMenus(prev => prev.map(item => {
                                        if (item.id === current_selected_menu){
                                            item.name = menu_name;
                                            item.description = menu_description;
                                            item.price = menu_price;
                                        }
                                        return item;
                                    }))
                                })


                            }
                        
                        }}

                        >Save</button>

                        <button className="btn-danger btn-lg btn text-center" style={{
                            marginLeft: '10px'
                        }}  onClick={()=>{
                            if (!current_selected_menu){
                                return;
                            }

                            const url = config.baseurl+"/restaurant_menu/"+current_selected_menu+"/";
                            fetch(url,{
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer "+token
                                },
                            })
                            .then(res => {
                                // setNeedUpdate(current_selected_menu);
                                window.location.reload();
                            })
                        }}

                        >Delete</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
</div>

        </>
    );
}