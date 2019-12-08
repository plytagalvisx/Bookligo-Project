import React, { Component } from "react";
import Books from "../Components/Books/Books";
import "./SearchView.css";

class SearchView extends Component {
  render() {
    return (
      <div className="SelectDish">
        <h2>This is the Search View</h2>

        {/* We pass the model as property to the BookList component */}
        <Books />
      </div>
    );
  }
}

export default SearchView;
