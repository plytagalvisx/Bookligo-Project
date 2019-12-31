import React, {Component} from "react";
import {Route} from "react-router-dom";
import HomeView from "./HomeView/HomeView";
import modelInstance from "./data/BookligoModel";
import SearchView from "./SearchView/SearchView";
import DetailsView from "./DetailsView/DetailsView";
import "./App.css";
import BookListView from "./BookListView/BookListView";
import ShoppingCartView from "./ShoppingCartView/ShoppingCartView";
import BookCategoryView from "./BookCategoryView/BookCategoryView";
import fireBase from "./firebaseConfig/firebaseConfig";
import LoginView from "./LoginView/LoginView";
import Error404View from "./Error404View/Error404View";
import Switch from "react-router-dom/Switch";
import Logout from "./Logout/Logout";
import Login from "./Login/Login";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Bookligo",
            //user: null,
        };
        //this.authenticationListener = this.authenticationListener.bind(this);
    }

    /*componentDidMount() {
        this.authenticationListener();
    }

    authenticationListener() {
        fireBase.auth().onAuthStateChanged((user) => {
            // console.log(user);
            if (user) {
                this.setState({ user });
                //localStorage.setItem('user', user.uid);
            } else {
                this.setState({ user: null });
                //localStorage.removeItem('user');
            }
        });
    }*/

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">{this.state.title}</h1>
                </header>

                {/* We rended diffrent component based on the path */}
                <Switch>
                    <Route exact path="/" component={HomeView}/>
                    {/*{this.state.user ? (<Route exact path="/" component={HomeView}/>) : (<Route exact path="/" component={LoginView}/>)}*/}

                    <Route
                        path="/search"
                        render={() => <SearchView model={modelInstance}/>}
                    />

                    <Route
                        path="/details"
                        render={() => <DetailsView model={modelInstance}/>}
                    />

                    <Route
                        path="/bookList"
                        render={() => <BookListView model={modelInstance}/>}
                    />

                    <Route
                        path="/bookCategory"
                        render={() => <BookCategoryView model={modelInstance}/>}
                    />

                    <Route
                        path="/logout"
                        render={() => <Logout model={modelInstance}/>}
                    />

                    <Route
                        path="/login"
                        render={() => <Login model={modelInstance}/>}
                    />

{/*
                    {this.state.user ? (<Route exact path="/shoppingCart" component={ShoppingCartView}/>) : (<Route exact path="/shoppingCart" component={LoginView}/>)}
                    {this.state.user ? (<Route exact path="/bookList" component={BookListView}/>) : (<Route exact path="/bookList" component={LoginView}/>)}
*/}

                    <Route
                        exact path="/*"
                        component={Error404View}
                    />
                </Switch>
                <NotificationContainer />

            </div>
        );
    }
}

export default App;
