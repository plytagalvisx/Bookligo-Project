import React, { Component } from "react";
import Fiction from "../Components/Fiction/Fiction";
import "./BookCategoryView.css";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class BookCategoryView extends Component {
    render() {
        return (
            <div className="SelectDish">
                <HeaderNavbar/>
                <h2>This is the Book Category View</h2>

                {/* We pass the model as property to the BookList component */}
                <Fiction model={this.props.model}/>
            </div>
        );
    }
}

export default BookCategoryView;
