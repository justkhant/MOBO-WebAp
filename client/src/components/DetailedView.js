import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FactCard from "./FactCard";
import testData from "../testData";

export default class DetailedView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaId: "",
      mediaType: "M",
      keywords: [],
      avg_rating: 0,
      img_url: "",
      recMedia: [],
    };

    this.getMediaInfo = this.getMediaInfo.bind(this);
    this.submitMedia = this.submitMedia.bind(this);
  }

  //TODO: set mediaId passed from dashboard

  //TODO: get the selected media's information
  getMediaInfo() {
    fetch("http://localhost:8081/media/" + this.state.mediaId, {
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
        (mediaInfo) => {
          if (!mediaInfo) return;

          //TODO: set states using response json
          this.setState({
            mediaType: mediaInfo.media_type,
            keywords: mediaInfo.keywords,
            avg_rating: mediaInfo.avg_rating,
            img_url: mediaInfo.img_url,
          });
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      );
  }

  //TODO: get a list of recommendations + create FactCards
  submitMedia() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/recommendations/" + this.state.mediaId, {
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
            //TODO: Pass attributes here to FactCard
            <FactCard
              id={0}
              genre={0}
              title={0}
              avg_rating={0}
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
              <h1 class="jumbotron-heading">Movie Title</h1>
              <p class="lead text-muted">Genres: </p>
              <p class="lead text-muted">Avg. Rating: __ (Number of Ratings)</p>
              <p class="lead text-muted">Keywords: </p>
              <p class="lead text-muted">Runtime:</p>
            </div>
          </section>

          <h2 style={{ color: "white" }}>Recommendations you might enjoy</h2>
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
            <h1 class="jumbotron-heading">Movie Title</h1>
            <p class="lead text-muted">Genres: </p>
            <p class="lead text-muted">Avg. Rating: __ (Number of Ratings)</p>
            <p class="lead text-muted">Keywords: </p>
            <p class="lead text-muted">Runtime:</p>
          </div>
        </section>

        <h2 style={{ color: "white" }}>Recommendations you might enjoy</h2>
      </div>
    );
  }
}
