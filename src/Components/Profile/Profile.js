import React, {Component} from "react";
import "./Profile.css";
import modelInstance from "../../data/BookligoModel";
import { auth } from "../../firebaseConfig/firebaseConfig";
import HomeView from "../../HomeView/HomeView.js";

class Profile extends Component {
    constructor(props) {
        super(props);
        // we put on state the properties we want to use and modify in the component
        this.state = {
            user: '',
        };
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to setup model observer
    async componentDidMount() {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
            }
        });
    }

    render() {
        console.log("User: ", this.state.user);
        if(this.state.user){
          return (
              <div>
                  <div>
                      {this.state.user ?
                          <div className = "profile">
                              <img className = "picture" alt="" src={this.state.user.photoURL}/>
                              <div className = "name">Name: {this.state.user.displayName}</div>
                              <div className = "Email">Email: {this.state.user.email}</div>
                              </div>
                              : ""
                            }
                            </div>
                            </div>
                          );
                }
        else{
          return(
            <HomeView />
          )
        }
    }
}

export default Profile;
