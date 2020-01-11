import React, { Component } from "react";
import {Redirect} from "react-router-dom";

class Login extends Component {
    render() {
        return (
            <Redirect to='/' />
        );
    }
}

export default Login;
