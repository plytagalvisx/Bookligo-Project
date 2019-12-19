import React, {Component} from 'react';
import fireBase from "../firebaseConfig/firebaseConfig";

class LoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    login() {
        fireBase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
            alert(" The email or password you entered isn't correct. Try entering it again. ")
            console.log(error);
        });
    }

    signup() {
        fireBase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
            <div>
                <div>
                    <label>Email address</label>
                    <input value={this.state.email} onChange={this.handleChange} type="email" name="email"
                           placeholder="Enter email"/>
                </div>
                <div>
                    <label>Password</label>
                    <input value={this.state.password} onChange={this.handleChange} type="password" name="password"
                           placeholder="Password"/>
                </div>
                <button type="submit" onClick={this.login}>Login</button>
                <button onClick={this.signup} style={{marginLeft: '25px'}}>Signup</button>
            </div>
        );
    }
}

export default LoginView;

