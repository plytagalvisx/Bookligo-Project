import React, { Component } from "react";
import BookList from "../Components/BookList/BookList";
import "./BookListView.css";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class BookListView extends Component {
    render() {
        return (
            <div className="SelectBook">
                <div className="booklist-title">My To-Read List</div>

                {/* We pass the model as property to the BookList component */}
                <BookList model={this.props.model} />
            </div>
        );
    }
}

export default BookListView;
