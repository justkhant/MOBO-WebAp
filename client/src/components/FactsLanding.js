import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class FactsLanding extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { fact1, fact2, fact3, fact4 } = this.props;

    let answer1 = [];
    let answer2 = [];
    let answer3 = [];
    let answer4 = [];

    if (fact1 !== null) {
      answer1 = (
        <p>
          {fact1[1]} was {fact1[10]} minutes long!
        </p>
      );
    }

    if (fact2 !== null) {
      answer2 = (
        <p>
          There are {fact2[0].length} movies tied at {fact2[0][0][10]} minutes
          long!
        </p>
      );
    }

    if (fact3 !== null) {
      answer3 = (
        <p>
          {fact3[1]} generated over ${fact3[9]} in revenue!
        </p>
      );
    }

    if (fact4 !== null) {
      answer4 = (
        <p>
          {fact4[0]} wrote {fact4[1]} books!
        </p>
      );
    }

    console.log(this.props);
    return (
      <div>
        <h4>What is the longest movie ever?</h4>
        {answer1}
        <h4>What is the shortest feature film ever?</h4>
        {answer2}
        <h4>What is the movie with the highest revenue?</h4>
        {answer3}
        <h4>Which author has written the most books?</h4>
        {answer4}
      </div>
    );
  }
}
