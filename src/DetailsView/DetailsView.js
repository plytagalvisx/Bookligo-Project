import React, {Component} from "react";
import Book from "../Components/Book/Book";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";
import "./DetailsView.css";

class DetailsView extends Component {
    render() {
        return (
            <div className="selectedDish">
                <HeaderNavbar/>
                <Book model={this.props.model}/>
            </div>
        );
    }
}

export default DetailsView;
