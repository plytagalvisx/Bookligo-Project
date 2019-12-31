import React, {Component} from "react";
import "./Profile.css";
import modelInstance from "../../data/BookligoModel";
import { auth } from "../../firebaseConfig/firebaseConfig";
import {Link} from "react-router-dom";

class Profile extends Component {
    constructor(props) {
        super(props);
        // we put on state the properties we want to use and modify in the component
        this.state = {
            status: "LOADING",
            user: modelInstance.getCurrentUser()
        };
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to setup model observer
    async componentDidMount() {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user, status: "LOADED",});
            }
        });
    }

    render() {
        console.log("User: ", this.state.user);

        return (
            <div className="shopping-cart-dropdown">
                <div className='app'>
                    {this.state.user ?
                        <div>
                            <div>Name: {this.state.user.displayName}</div>
                            <div>Email: {this.state.user.email}</div>
                            <img alt="" src={this.state.user.photoURL}/>
                        </div>
                        : ""
                    }
                </div>
            </div>
        );
    }
}

export default Profile;
