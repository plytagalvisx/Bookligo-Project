import React, { Component } from "react";
import {Link} from "react-router-dom";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class Login extends Component {
    render() {
        return (
            <div className="SelectDish">
                <Link to="/">
                    <h2>Go back Home</h2>
                </Link>
            </div>
        );
    }
}

export default Login;
