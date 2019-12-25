import React, { Component } from "react";
import "./HeaderNavbar.css";
import {Link} from "react-router-dom";
import firebase, {auth, provider} from "../../firebaseConfig/firebaseConfig";
import modelInstance from "../../data/BookligoModel";
import LoginView from "../../LoginView/LoginView";

class HeaderNavbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: modelInstance.getCurrentUser(),
        };
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
    }

    async componentDidMount() {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
            }
        });
    }

    logout() {
        firebase.auth().signOut();
    }

    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({user});
            });
    }

    render() {

        console.log("HELLO: ", this.state.user);

        return (
            <div className="SelectDish">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/bookCategory">Categories</Link>
                    </li>
                    <li>
                        <Link to="/bookList">My Book List</Link>
                    </li>
                    <li className="dropdown">
                        <a href="javascript:void(0)" className="dropbtn">Dropdown</a>
                        <div className="dropdown-content">
                            <Link to="/">Link 1</Link>
                            <Link to="/">Link 2</Link>
                            <Link to="/">Link 3</Link>
                        </div>
                    </li>
                    <li>
                        <Link to="/search">Search</Link>
                    </li>
                    <li className="shoppingCart">
                        <Link to="/shoppingCart">&#x1F6D2;</Link>
                    </li>
                    <li>
                        {this.state.user ?
                            <Link to="/logout" onClick={this.logout}>Logout</Link>
                            :
                            <Link to="/login" onClick={this.login}>Login</Link>
                        }
                    </li>
                    <li className="dropdown">
                        {this.state.user ?
                            <div>
                                <a href="javascript:void(0)" className="dropbtn">
                                    <img className="dish-image-shoppingCart"  alt="" src={this.state.user.photoURL}/>
                                </a>
                                <div className="dropdown-content">
                                    <Link to="/">Profile</Link>
                                </div>
                            </div>
                            : ""
                        }

                    </li>
                </ul>
            </div>
        );
    }
}

export default HeaderNavbar;
