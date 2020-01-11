import React, {Component} from "react";
import Book from "../Components/Book/Book";
import "./DetailsView.css";

class DetailsView extends Component {
    render() {
        return (
            <div className="selectedDish">
                <Book model={this.props.model} bookID={window.location.href.split('/').pop().split('?')[0]}/>
            </div>
        );
    }
}

export default DetailsView;
