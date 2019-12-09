import React, { Component } from "react";
import "./HeaderNavbar.css";
import {Link} from "react-router-dom";

class HeaderNavbar extends Component {
    render() {
        return (
            <div className="SelectDish">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/bookCategory">Books</Link>
                    </li>
                    <li>
                        <Link to="/bookList">My Book List</Link>
                    </li>
                    <li>
                        <Link to="/search">&#128269;</Link>
                    </li>
                    <li className="dropdown">
                        <a href="javascript:void(0)" className="dropbtn">Dropdown</a>
                        <div className="dropdown-content">
                            <a href="#">Link 1</a>
                            <a href="#">Link 2</a>
                            <a href="#">Link 3</a>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default HeaderNavbar;
