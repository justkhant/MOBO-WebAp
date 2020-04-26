import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class DetailsView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;

    // BOOK
    if (data[4] === "B") {
      return (
        <section className="jumbotron">
          <img
            src="https://images-na.ssl-images-amazon.com/images/I/61VUik8NJ8L.jpg"
            className="float-left align-middle"
            alt="Movie Image"
            height="250"
            style={{ marginRight: "30px" }}
          ></img>
          <div className="container">
            <h1 className="jumbotron-heading">{data[1]}</h1>
            <p className="lead text-muted">Authors: {data[9]}</p>
            <p className="lead text-muted">
              Avg. Rating: {data[6]} ({data[11]})
            </p>
            <p className="lead text-muted">Review Count: {data[13]}</p>
            <p className="lead text-muted">Keywords: {data[5]}</p>
            <p className="lead text-muted">Page Count: {data[12]}</p>
          </div>
        </section>
      );
    }
    //MOVIE
    return (
      <section className="jumbotron">
        <img
          src="http://image.tmdb.org/t/p/w185//vzmL6fP7aPKNKPRTFnZmiUfciyV.jpg"
          className="float-left align-middle"
          alt="Movie Image"
          height="250"
          style={{ marginRight: "30px" }}
        ></img>
        <div className="container">
          <h1 className="jumbotron-heading">Movie Title</h1>
          <p className="lead text-muted">Genres: </p>
          <p className="lead text-muted">Avg. Rating: __ (Number of Ratings)</p>
          <p className="lead text-muted">Keywords: </p>
          <p className="lead text-muted">Runtime:</p>
        </div>
      </section>
    );
  }
}
