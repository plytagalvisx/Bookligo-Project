import React, { Component } from "react";
import "./HomeView.css";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class HomeView extends Component {
  render() {
    return (
      <div className="Welcome">
          <h2>Welcome to Bookligo!</h2>
          <h3>Find Yourself Something New To Read</h3>
      </div>
    );
  }
}

export default HomeView;
