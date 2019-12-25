import React, { Component } from "react";
import Books from "../Components/Books/Books";
import "./SearchView.css";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class SearchView extends Component {
  render() {
    return (
      <div className="SelectDish">
          <HeaderNavbar/>
        {/* We pass the model as property to the BookList component */}
        <Books />
      </div>
    );
  }
}

export default SearchView;
