import React, {Component} from "react";
import {Route} from "react-router-dom";
import HomeView from "./HomeView/HomeView";
import modelInstance from "./data/BookligoModel";
import SearchView from "./SearchView/SearchView";
import DetailsView from "./DetailsView/DetailsView";
import "./App.css";
import BookListView from "./BookListView/BookListView";
import BookCategoryView from "./BookCategoryView/BookCategoryView";
import fireBase from "./firebaseConfig/FireBase";
import LoginView from "./LoginView/LoginView";
import Error404View from "./Error404View/Error404View";
import Switch from "react-router-dom/Switch";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Bookligo",
            user: null,
        };
        this.authenticationListener = this.authenticationListener.bind(this);
    }

    componentDidMount() {
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
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">{this.state.title}</h1>
                </header>

                {/* We rended diffrent component based on the path */}
                <Switch>
                    {this.state.user ? (<Route exact path="/" component={HomeView}/>) : (<Route exact path="/" component={LoginView}/>)}

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
                        exact path="/*"
                        component={Error404View}
                    />
                </Switch>

            </div>
        );
    }
}

export default App;
