import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./HomeView.css";

class HomeView extends Component {
  render() {
    return (
      <div className="Welcome">
        <p>HomeView to the bookligo store React Startup code!</p>

        <Link to="/search">
          <button>Start planning</button>
        </Link>
      </div>
    );
  }
}

export default HomeView;
