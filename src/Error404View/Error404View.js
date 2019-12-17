import React, { Component } from "react";
import "./Error404View.css";

class Error404View extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Welcome">
                <div id="container-404">404 Page not found</div>
            </div>
        );
    }
}

export default Error404View;
