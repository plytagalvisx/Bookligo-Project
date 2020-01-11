import React, { Component } from "react";
import Books from "../Components/Books/Books";
import "./SearchView.css";

class SearchView extends Component {
  render() {
    return (
      <div className="SelectDish">
        {/* We pass the model as property to the Books component */}
        <Books />
      </div>
    );
  }
}

export default SearchView;
