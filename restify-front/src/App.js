import './App.css';
import Router from './components/Routers';
import { useState } from "react";
import Cookies from 'universal-cookie';
import { useEffect } from "react";
import config from "./config.json";
import { APIContext } from './Contexts/APIContext';
import Footer from './components/Footer';



function App() {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });
  const [restaurantOwner, setRestaurantOwner] = useState(null);
  const [notifications_count, setNotifications_count] = useState(0);

  const [background_color, setBackground_color] = useState("white");
  const [footer_color, setFooter_color] = useState("black");

  const cookies = new Cookies();

  if (! cookies.get("dark_mode")) {
    cookies.set("dark_mode", "false", { path: "/" });
  }

  useEffect(() => {
    const tags = ["h1","h2"]

    if (cookies.get("dark_mode")==="true") {
      document.body.style.background = "#1F263E";
      tags.forEach(tag => {
        for (let i = 0; i < document.getElementsByTagName(tag).length; i++) {
          document.getElementsByTagName(tag)[i].style.color = "white";
        }
      });
          
    }else{
      document.body.style.background = "#F8F8F5";
      tags.forEach(tag => {
        for (let i = 0; i < document.getElementsByTagName(tag).length; i++) {
          if (document.getElementsByTagName(tag)[i].id="navbar-title") {
            return;
          }
          document.getElementsByTagName(tag)[i].style.color = "black";
        }
      });
    }
  },[])
  
  
  useEffect(() => {
    const cookies = new Cookies();
    const access_token = cookies.get('access_token');
    setToken(access_token);
  }, []);

  useEffect(() => {
    if (token) {
      console.log("refressing userData");
      fetch(`${config.baseurl}/user/info/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log("user data", data);
          setUserData(data);
        })
        // refersh restaurant owner
        console.log("refressing restaurantOwner");
        fetch(`${config.baseurl}/restaurant_general/information/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

          }
        })
          .then(res => res.json())
          .then(data => {
            console.log("restaurant owner", data.results);
            if (data.count > 0) {
              setRestaurantOwner(data.results[0]);
              console.log(restaurantOwner);
            }
          })
          // refersh notifications
          console.log("refressing notifications");
          fetch(`${config.baseurl}/user/notifications/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })

            .then(res => res.json())
            .then(data => {
              console.log("notifications", data);
              setNotifications_count(data.count);
            })
    }

  }, [token]);

  return (
    <APIContext.Provider value={{ userData, setUserData,token, setToken,  restaurantOwner, setRestaurantOwner ,notifications_count,setNotifications_count, background_color, setBackground_color, footer_color, setFooter_color}}>
      <div style={{
        height: "100vh",
      }}><Router /></div>
      <Footer/>
      
    </APIContext.Provider>


  );
}

export default App;
