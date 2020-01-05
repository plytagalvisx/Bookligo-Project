import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class Login extends Component {
    render() {
        return (
            <Redirect to='/' />
        );
    }
}

export default Login;
