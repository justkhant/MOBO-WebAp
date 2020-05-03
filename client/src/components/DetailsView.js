import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Dashboard.css";

export default class DetailsView extends React.Component {
  constructor(props) {
    super(props);
  }

  onExit(e) {
    console.log("hello");
    this.props.onExit();
  }

  render() {
    const { data } = this.props;

    // BOOK
    if (data[2] == "B") {
      return (
        <section className="jumbotron">
          <button type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <img
            src={data[5]}
            className="float-left align-middle"
            alt="Book Cover Image"
            height="250"
            style={{ marginRight: "40px", marginBottom: "30px" }}
          ></img>
          <div className="container">
            <h1 className="jumbotron-heading">{data[1]}</h1>
            <p className="text-muted">
              <strong>Author(s):</strong> {data[7]}
            </p>
            <p className="text-muted">
              <strong>Avg. Rating:</strong> {data[4]}/10 ({data[9]})
            </p>
            <p className="text-muted">
              <strong>Review Count:</strong> {data[11]}
            </p>
            <p className="text-muted">
              <strong>Description:</strong> {data[8]}
            </p>
            <p className="text-muted">
              <strong>Length:</strong> {data[10]} pages
            </p>
          </div>
        </section>
      );
    }
    //MOVIE
    return (
      <section className="jumbotron">
        <button
          type="button"
          class="close"
          aria-label="Close"
          onClick={this.onExit.bind(this)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <img
          src={data[5]}
          className="float-left align-middle"
          alt="Movie Cover Image"
          height="250"
          style={{ marginRight: "40px", marginBottom: "30px" }}
        ></img>
        <div className="container">
          <h1 className="jumbotron-heading">{data[1]}</h1>
          <p className="text-muted">
            <strong>Released:</strong> {data[8]}
          </p>
          <p className="text-muted">
            <strong>Runtime:</strong> {data[11]} minutes
          </p>
          <p className="text-muted">
            <strong>Avg. Rating:</strong> {data[4]}/10 ({data[9]})
          </p>
          <p className="text-muted">
            <strong>Keywords:</strong> {data[3]}
          </p>
          <p className="text-muted">
            <strong>Revenue:</strong> ${data[10]}
          </p>
          <p className="text-muted">
            <strong>Description:</strong> {data[7]}
          </p>
        </div>
      </section>
    );
  }
}
