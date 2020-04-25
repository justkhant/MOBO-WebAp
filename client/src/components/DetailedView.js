import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FactCard from "./FactCard";
import testData from "../testData";

export default class DetailedView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recMedia: [],
    };

    this.submitMedia = this.submitMedia.bind(this);
  }

  //TODO: get a list of recommendations + create FactCards
  submitMedia() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/recommendations/" + this.props.data.media_id, {
      method: "GET", // The type of HTTP request.
    })
      .then(
        (res) => {
          // Convert the response data to a JSON.
          return res.json();
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      )
      .then(
        (recList) => {
          if (!recList) return;
          let recDivs = recList.map((rec, i) => (
            // TODO: Pass attributes here to FactCard, how to get genre, desc/overview, rating_count?
            <FactCard
              id={rec.media_id}
              genre={0}
              title={rec.title}
              avg_rating={rec.avg_rating}
              rating_count={0}
              desc={0}
            />
          ));

          this.setState({
            recMedia: recDivs,
          });
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      );
  }

  render() {
    console.log(this.props.data);

    /*
    this.props.data contains the data for the selected row
    [ 16943, 'Harry And Max', 'en', 2004-01-01T07:00:00.000Z, 5, 'M', 31 ]
    */

// TODO: fill in correct attributes in Media display
    //MOVIE
    if (this.state.mediaType == "M") {
      //TODO: how to get variable url into img src
      //var url = "http://image.tmdb.org/t/p/w185/" + this.props.data.img_url;

      return (
        <div
          className="detailedView"
          id={this.props.id}
          onClick={this.props.onClick}
        >
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

          <h2 style={{ color: "white" }}>Recommendations you might enjoy</h2>
          <div className="card-deck">{this.state.recMedia}</div>
        </div>
      );
    }

    //BOOK
    return (
      <div
        className="detailedView"
        id={this.props.id}
        onClick={this.props.onClick}
      >
        <section className="jumbotron">
          <img
            src="https://images-na.ssl-images-amazon.com/images/I/61VUik8NJ8L.jpg"
            className="float-left align-middle"
            alt="Movie Image"
            height="250"
            style={{ marginRight: "30px" }}
          ></img>
          <div className="container">
            <h1 className="jumbotron-heading">Book Title</h1>
            <p className="lead text-muted">Genres: </p>
            <p className="lead text-muted">Avg. Rating: __ ()</p>
            <p className="lead text-muted">Reivew Count:</p>
            <p className="lead text-muted">Keywords: </p>
            <p className="lead text-muted">Page Count:</p>
          </div>
        </section>

        <h2 style={{ color: "white" }}>Recommendations you might enjoy</h2>
        <div className="card-deck">{this.state.recMedia}</div>
      </div>
    );
  }
}
