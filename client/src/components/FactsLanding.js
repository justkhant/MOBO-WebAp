import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class FactsLanding extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const fact1 = this.props.fact1;
    return (
      <div>
        <h4>What is the longest movie ever?</h4>
        <p>
          {fact1[1]} was {fact1[10]} minutes long!
        </p>
        <h4>What is the shortest feature film ever?</h4>
        <h4>What is the movie with the highest revenue?</h4>
        <h4>Which author has written the most books?</h4>
      </div>
    );
  }
}
