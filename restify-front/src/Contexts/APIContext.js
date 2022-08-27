import {createContext} from "react";

export const APIContext = createContext({
    userData: [],
    setuserData: () => {},
    token: null,
    settoken: () => {},
    restaurantOwner:{},
    setRestaurantOwner:()=>{},
    notifications_count:0,
    setNotifications_count:()=>{},
    background_color:"white",
    setBackground_color:()=>{},
    footer_color:"blakc",
    setFooter_color:()=>{},
})