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

    this.getMediaInfo = this.getMediaInfo.bind(this);
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
            //TODO: Pass attributes here to FactCard, how to get genre, desc/overview, rating_count?
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
    //MOVIE
    if (this.state.mediaType == "M") {
      var url = "http://image.tmdb.org/t/p/w185/" + this.props.data.img_url;
      return (
        <div
          className="detailedView"
          id={this.props.id}
          onClick={this.props.onClick}
        >
          <section class="jumbotron">
            <img
              src="http://image.tmdb.org/t/p/w185//vzmL6fP7aPKNKPRTFnZmiUfciyV.jpg"
              class="float-left align-middle"
              alt="Movie Image"
              height="250"
              style={{ marginRight: "30px" }}
            ></img>
            <div class="container">
              <h1 class="jumbotron-heading">
                Movie Title {this.props.data.title}
              </h1>
              <p class="lead text-muted">Genres: </p>
              <p class="lead text-muted">Avg. Rating: __ (Number of Ratings)</p>
              <p class="lead text-muted">Keywords: </p>
              <p class="lead text-muted">Runtime:</p>
            </div>
          </section>

          <h2 style={{ color: "white" }}>Recommendations you might enjoy</h2>
          <div class="card-deck">{this.props.recMedia}</div>
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
        <section class="jumbotron">
          <img
            src="https://images-na.ssl-images-amazon.com/images/I/61VUik8NJ8L.jpg"
            class="float-left align-middle"
            alt="Movie Image"
            height="250"
            style={{ marginRight: "30px" }}
          ></img>
          <div class="container">
            <h1 class="jumbotron-heading">
              Book Title {this.props.data.title}
            </h1>
            <p class="lead text-muted">Genres: </p>
            <p class="lead text-muted">
              Avg. Rating: __ ({this.props.data.rating_count})
            </p>
            <p class="lead text-muted">
              Reivew Count: {this.props.data.review_count}
            </p>
            <p class="lead text-muted">Keywords: </p>
            <p class="lead text-muted">Page Count: {this.props.data.pages}</p>
          </div>
        </section>

        <h2 style={{ color: "white" }}>Recommendations you might enjoy</h2>
      </div>
    );
  }
}
