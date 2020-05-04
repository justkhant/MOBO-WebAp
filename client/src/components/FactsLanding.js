import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class FactsLanding extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h4>What is the shortest movie ever?</h4>
        <h4>What is the longest movie ever?</h4>
        <h4>Which author has written the most books?</h4>
        <h4>What is the movie with the highest revenue?</h4>
      </div>
    );
  }
}
