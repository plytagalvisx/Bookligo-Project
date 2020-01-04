import React, { Component } from "react";
import BookList from "../Components/BookList/BookList";
import "./BookListView.css";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class BookListView extends Component {
    render() {
        return (
            <div className="SelectBook">
                <h2>My To-Read List</h2>

                {/* We pass the model as property to the BookList component */}
                <BookList model={this.props.model} />
            </div>
        );
    }
}

export default BookListView;
