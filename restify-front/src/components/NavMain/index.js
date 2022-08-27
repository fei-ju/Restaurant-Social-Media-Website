// using mui make a navbar component
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Link, Outlet } from 'react-router-dom';
import { Box } from '@material-ui/core';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useContext } from 'react';
import { APIContext } from '../../Contexts/APIContext';
import { useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';

import MenuItem from '@mui/material/MenuItem';
import { Switch } from '@mui/material';
import Cookies from 'universal-cookie';


function return_nav(token, restaurantOwner, userData, notifications_count, handleProfileMenuOpen, handleProfileMenuOpen2, restaurant_dashboard,setBackground_color, setFooter_color) {



  const before_login = [
    {
      name: 'Home',
      path: '/',
    }
  ];


  const all_navs = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name : "Feed",
      path : "/feed/",
    }

  ];



  return <>
    <Box display='flex' flexGrow={1}>
      <h2 style={{
        marginLeft: "10px",
        marginRight: "30px",
      }}
      id = "navbar-title">
      Restify</h2>

          <Button color="default"  style={{
            // pick a color for the navbar
            backgroundColor: 'white',
            marginRight: '20px',
          }} onClick={() => {
            // navigate to notifications
            window.location.href = "/";
    
          }}>Home
          </Button>
          {token ? <Button color="default"  style={{
            // pick a color for the navbar
            backgroundColor: 'white',
            marginRight: '20px',
          }} onClick={() => {
            // navigate to notifications
            window.location.href = "/feed/";
    
          }}>Feed
          </Button>:null}
        

      

      {/* Restaruant owner or Create restaurant */}

      {token ? <Button color="default" value="hi" style={{
        backgroundColor: 'white',
        marginRight: '10px'
      }} onClick={handleProfileMenuOpen2}>Restaurant Dashboard</Button> : null}

    </Box>

      {/* dark mode switch */}
      Dark Mode:
      <Switch
      checked={new Cookies().get("dark_mode")==="true" ? true : false}
      onClick={(e) => {
        console.log(e.target.checked);
        const cookies = new Cookies();
        if(e.target.checked){
          cookies.set("dark_mode", true, { path: '/' });
                }else{
                  cookies.set("dark_mode", false, { path: '/' });
                }
                window.location.reload();

      }}
      ></Switch>

    {token ? <b>           
      Hi, {userData.first_name}</b>:null}

    {token ? <><IconButton
      size="medium"
      color="inherit"
      onClick={() => {
        // navigate to notifications
        window.location.href = "/mynotifications";

      }}
    >
      <Badge badgeContent={notifications_count} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton></> : null}

    <IconButton
      size="medium"
      edge="end"
      aria-label="account of current user"
      aria-haspopup="true"
      color="inherit"
      style={{ marginRight: '10px' }}
      onClick={handleProfileMenuOpen}
    >
      <AccountCircle />
    </IconButton>
    


  </>;
}


function user_nav(token, restaurantOwner, userData, notifications_count, handleProfileMenuOpen, handleProfileMenuOpen2) {
  const user_navs = [
    {
      name: 'Sign In',
      path: '/signin',
    },
    {
      name: 'Sign Up',
      path: '/signup',
    }
  ];

  const after_login = [
    {
      name: 'Profile',
      path: '/profile',
    },
    {
      name: 'Logout',
      path: '/logout',
    }
  ];

  return token ? after_login.map(nav => (

    <MenuItem onClick={
      () => {
        window.location.href = nav.path
      }
    } key={nav.name}>{nav.name}</MenuItem>
  ))
    :

    user_navs.map(nav => (

      <MenuItem onClick={
        () => {
          window.location.href = nav.path
        }
      } key={nav.name} >{nav.name}</MenuItem>
    ))


}

function restaurant_nav(token, restaurantOwner, userData, notifications_count, handleProfileMenuOpen, handleProfileMenuOpen2) {
  const restaurant_owner_navs = [
    {
      name: 'My Restaurant Info',
      path: '/myrestaurant',
    },
    {
      name: "My Menu",
      path: "/mymenu",
    },
    {
      name:"My Comments",
      path:"/mycomments",
    },
    {
      name:"My Posts",
      path:"/myposts",
    }
  ];
  console.log("restaurant owner navs", token, restaurantOwner);
  return token ? (!restaurantOwner ?
    <MenuItem onClick={
      () => {
        window.location.href = "/create_restaurant"
      }
    }>Create Restaurant</MenuItem>
    :

    restaurant_owner_navs.map(nav => (

      <MenuItem onClick={
        () => {
          window.location.href = nav.path
        }
      } key={nav.name}>{nav.name}</MenuItem>
    )))

    : null
}



export default function NavMain() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [restaurant_dashboard, setRestaurant_dashboard] = React.useState([]);
  const [user_menu, setUser_menu] = React.useState([]);
  const {setBackground_color, setFooter_color} = useContext(APIContext);


  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfileMenuOpen2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleMenuClose2 = () => {
    setAnchorEl2(null);
  };



  const { token, restaurantOwner, userData, notifications_count } = useContext(APIContext);
  const [navs, setNavs] = React.useState(
    return_nav(token, restaurantOwner, userData, notifications_count, handleProfileMenuOpen, handleProfileMenuOpen2, restaurant_dashboard,setBackground_color, setFooter_color)
  );
  useEffect(() => {
    console.log("hi", token)
    console.log("hi", restaurantOwner)
    const dash_navs = restaurant_nav(token, restaurantOwner, userData, notifications_count, handleProfileMenuOpen, handleProfileMenuOpen2);
    console.log("dash_navs",dash_navs)
    setRestaurant_dashboard(dash_navs);
    const user_navs = user_nav(token, restaurantOwner, userData, notifications_count, handleProfileMenuOpen, handleProfileMenuOpen2);
    console.log("user_navs",user_navs)
    setUser_menu(user_navs);
    setNavs(return_nav(token, restaurantOwner, userData, notifications_count, handleProfileMenuOpen, handleProfileMenuOpen2, restaurant_dashboard,setBackground_color, setFooter_color));
  }, [token, restaurantOwner, notifications_count,userData]);

  const isMenuOpen = Boolean(anchorEl);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      style={{
        marginTop: '50px',
      }}
    >
      {user_menu}
    </Menu>
  );

  const isMenuOpen2 = Boolean(anchorEl2);

  const menuId2 = 'primary-search-account-menu2';
  const renderMenu2 = (
    <Menu
      anchorEl={anchorEl2}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId2}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen2}
      onClose={handleMenuClose2}
      style={{
        marginTop: '50px',
      }}
    >
      {restaurant_dashboard}

    </Menu>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {navs}
        </Toolbar>

      </AppBar>
      {renderMenu}
      {renderMenu2}
      <Outlet />
    </>
  );
}