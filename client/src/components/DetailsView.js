import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class DetailsView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;

    // BOOK
    if (data[2] == "B") {
      return (
        <section className="jumbotron">
          <img
            src={data[5]}
            className="float-left align-middle"
            alt="Book Cover Image"
            height="250"
            style={{ marginRight: "30px" }}
          ></img>
          <div className="container">
            <h1 className="jumbotron-heading">{data[1]}</h1>
            <p className="lead text-muted">Author(s): {data[7]}</p>
            <p className="lead text-muted">
              Avg. Rating: {data[4]} ({data[9]})
            </p>
            <p className="lead text-muted">Review Count: {data[11]}</p>
            <p className="lead text-muted">Description: {data[8]}</p>
            <p className="lead text-muted">Length: {data[10]} pages</p>
          </div>
        </section>
      );
    }
    //MOVIE
    return (
      <section className="jumbotron">
        <img
          src={data[5]}
          className="float-left align-middle"
          alt="Movie Cover Image"
          height="250"
          style={{ marginRight: "30px" }}
        ></img>
        <div className="container">
          <h1 className="jumbotron-heading">{data[1]}</h1>
          <p className="lead text-muted">Released: {data[8]} </p>
          <p className="lead text-muted">Runtime: {data[11]} minutes</p>
          <p className="lead text-muted">
            Avg. Rating: {data[4]} ({data[9]})
          </p>
          <p className="lead text-muted">Keywords: {data[3]}</p>
          <p className="lead text-muted">Revenue: {data[10]}</p>
          <p className="lead text-muted">Description: {data[7]}</p>
        </div>
      </section>
    );
  }
}
