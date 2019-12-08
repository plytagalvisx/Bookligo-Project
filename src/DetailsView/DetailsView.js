import React, {Component} from "react";
import Book from "../Components/Book/Book";
import "./DetailsView.css";

class DetailsView extends Component {
    render() {
        return (
            <div className="selectedDish">
                <Book model={this.props.model}/>
            </div>
        );
    }
}

export default DetailsView;
