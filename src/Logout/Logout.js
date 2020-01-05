import React, { Component } from "react";
import {Link, Redirect} from "react-router-dom";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class Logout extends Component {
    render() {
        return (
            <Redirect to='/' />
        );
    }
}

export default Logout;
