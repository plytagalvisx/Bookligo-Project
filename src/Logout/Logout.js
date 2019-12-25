import React, { Component } from "react";
import {Link} from "react-router-dom";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class Logout extends Component {
    render() {
        return (
            <div className="SelectDish">
                <HeaderNavbar/>
                <Link to="/">
                    <h2>Go back Home</h2>
                </Link>
            </div>
        );
    }
}

export default Logout;
