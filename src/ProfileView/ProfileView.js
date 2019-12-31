import React, { Component } from "react";
import Profile from "../Components/Profile/Profile";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class ProfileView extends Component {
    render() {
        return (
            <div>
                <HeaderNavbar/>
                <Profile />
            </div>
        );
    }
}

export default ProfileView;
