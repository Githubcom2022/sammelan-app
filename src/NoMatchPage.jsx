import React, { Component } from "react";

export default class NoMatchPage extends Component {
  render() {
    return (
      <div>
        <h4 className="text-danger">Page not found</h4>
      </div>
    );
  }

  componentDidMount() {
    document.title = "404 - eCommerce";
  }
}
