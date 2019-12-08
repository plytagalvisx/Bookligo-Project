import React, {Component} from "react";
import {Route} from "react-router-dom";
import HomeView from "./HomeView/HomeView";
import modelInstance from "./data/DinnerModel";
import SearchView from "./SearchView/SearchView";
import DetailsView from "./DetailsView/DetailsView";
import "./App.css";
import BookListView from "./BookListView/BookListView";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Bookligo"
        };
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">{this.state.title}</h1>
                </header>

                {/* We rended diffrent component based on the path */}
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

            </div>
        );
    }
}

export default App;
