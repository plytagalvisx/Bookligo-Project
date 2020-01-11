import React, { Component } from "react";
import BookCategories from "../Components/BookCategories/BookCategories";
import "./BookCategoryView.css";

class BookCategoryView extends Component {
    render() {
        return (
            <div className="SelectDish">

                {/* We pass the model as property to the BookCategories component */}
                <BookCategories model={this.props.model}/>
            </div>
        );
    }
}

export default BookCategoryView;
