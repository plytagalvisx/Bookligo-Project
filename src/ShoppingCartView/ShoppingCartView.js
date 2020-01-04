import React, { Component } from "react";
import ShoppingCart from "../Components/ShoppingCart/ShoppingCart";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class ShoppingCartView extends Component {
    render() {
        return (
            <div className="SelectBook">
                {/* We pass the model as property to the ShoppingCart component */}
                <ShoppingCart model={this.props.model} />
            </div>
        );
    }
}

export default ShoppingCartView;
