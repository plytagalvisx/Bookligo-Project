import React, {Component} from "react";
import {Route} from "react-router-dom";
import HomeView from "./HomeView/HomeView";
import modelInstance from "./data/BookligoModel";
import SearchView from "./SearchView/SearchView";
import DetailsView from "./DetailsView/DetailsView";
import "./App.css";
import BookListView from "./BookListView/BookListView";
import BookCategoryView from "./BookCategoryView/BookCategoryView";
import Error404View from "./Error404View/Error404View";
import Switch from "react-router-dom/Switch";
import Logout from "./Logout/Logout";
import Login from "./Login/Login";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import ProfileView from "./ProfileView/ProfileView";
import Link from "react-router-dom/Link";
import HeaderNavbar from "./Components/HeaderNavbar/HeaderNavbar";
import PurchaseView from "./PurchaseView/PurchaseView";
import PrintoutView from "./PrintoutView/PrintoutView";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Bookligo",
        };
    }

    render() {
        return (
            <div className="App">
               <header className="App-header">
                <Link to="/">
                    <h1 className="App-title">{this.state.title}</h1>
                </Link>
            </header>

            <HeaderNavbar/>

            {/* We rendered different components based on the path */}
            <Switch>
                <Route exact path="/" component={HomeView}/>
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

                <Route
                    path="/profile"
                    render={() => <ProfileView model={modelInstance}/>}
                />

                <Route
                    path="/confirmPurchase"
                    render={() => <PurchaseView model={modelInstance}/>}
                />

                <Route
                    path="/printout"
                    render={() => <PrintoutView model={modelInstance}/>}
                />

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
