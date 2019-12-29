import React, { Component } from "react";
import BookCategories from "../Components/BookCategories/BookCategories";
import "./BookCategoryView.css";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class BookCategoryView extends Component {
    render() {
        return (
            <div className="SelectDish">
                <HeaderNavbar/>

                {/* We pass the model as property to the BookList component */}
                <BookCategories model={this.props.model}/>
            </div>
        );
    }
}

export default BookCategoryView;
