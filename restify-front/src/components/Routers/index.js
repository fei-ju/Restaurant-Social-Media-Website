import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignInSide from "../Signin";
import NavMain from "../NavMain";
import RestaurantMultiBoxes from "../RestaurantShowCase/RestaurantMultiBoxes";
import  { Navigate } from 'react-router-dom'
import Logout from "../Logout";
import Cookies from 'universal-cookie';
import {APIContext} from "../../Contexts/APIContext";
import {useContext} from "react";
import CreateRestaurant from "../RestaurantRelated/CreateRestaurant";
import MyRestaurant from "../RestaurantRelated/MyRestaurant";
import RestaurantOwnerMenu from "../RestaurantRelated/RestaurantOwnerMenu";
import NotificationsPage from "../RestaurantRelated/NotificationsPage";
import RestaurantOwnerComments from "../RestaurantRelated/RestaurantOwnerComments";
import UserFeed from "../Feed";
import RestaurantOwnerPosts from "../RestaurantRelated/RestaurantOwnerPosts";
import PostPage from "../RestaurantShowCase/PostPage";
import RestaurantPage from "../RestaurantRelated/RestaurantPage";
import RestaurantPageWithID from "../RestaurantShowCase/RestaurantPage"
import NewLogin from "../UserPages/NewLogin";
import NewSignup from "../UserPages/NewSignup";
import NewEditProfile from "../UserPages/NewEditProfile";
import NewRestaurantCreate from "../RestaurantRelated/NewCreateRestaurant";

const ProtectedRoute = ({token,setToken,children}) => {
    console.log("protect check",token);
    const cookies = new Cookies();
    const access_token = cookies.get('access_token');
    if (!access_token) {
      return <Navigate to="/signin/" />;
    }
  
    return children;
  };

const Router = () => {
    const {token} = useContext(APIContext);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<NavMain  />}>
                    {/* <Route path="signin"  element={<SignInSide />} /> */}
                    <Route path="signin"  element={<NewLogin />} />
                    <Route path="signup"  element={<NewSignup />} />
                    {/* <Route path="editprofile"  element={<NewEditProfile />} /> */}
                    {/* <Route path="signup" element={<SignUp />} /> */}
                    <Route index element={<RestaurantMultiBoxes />} />
                    <Route path="logout" element={<Logout  />} />
                    <Route path="profile" element={<ProtectedRoute token = {token}><NewEditProfile /></ProtectedRoute>} />
                    {/* <Route path="creat_restaurant" element={<ProtectedRoute token = {token}><CreateRestaurant /></ProtectedRoute>} /> */}
                    <Route path="create_restaurant" element={<ProtectedRoute token = {token}><NewRestaurantCreate /></ProtectedRoute>} />

                    
                    <Route path="myrestaurant" element={<ProtectedRoute token = {token}><MyRestaurant /></ProtectedRoute>} />
                    <Route path="mymenu" element={<ProtectedRoute token = {token}><RestaurantOwnerMenu /></ProtectedRoute>} />
                    <Route path="mynotifications" element={<ProtectedRoute token = {token}><NotificationsPage /></ProtectedRoute>} />
                    <Route path="myComments" element={<ProtectedRoute token = {token}><RestaurantOwnerComments /></ProtectedRoute>} />
                    <Route path="myposts" element={<ProtectedRoute token = {token}><RestaurantOwnerPosts /></ProtectedRoute>} />
                    <Route path="post/:post_id" element={<PostPage />}/>
                    <Route path="feed" element={<UserFeed /> } />
                    <Route path="restaurant" element={<RestaurantPage /> } />
                    <Route path="restaurant/:restaurant_id" element={<RestaurantPageWithID /> } />
                </Route>
                
            </Routes>
            <br/><br/><br/><br/><br/>
        </BrowserRouter>
    )
}

export default Router