import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FactCard from "./FactCard";
import testData from "../testData";

export default class DetailedView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaInfo: [],
      recMedia: [],
    };

    this.submitMedia = this.submitMedia.bind(this);
    this.getMediaDetails = this.getMediaDetails.bind(this);
  }

  componentDidMount() {
    this.getMediaDetails();
  }

  //TODO: get's media's info based on media_id
  getMediaDetails() {
    console.log("hello");
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/media/55511", {
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
        (info) => {
          if (!info) return;
          console.log(info);
          this.setState({
            mediaInfo: info.rows,
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
            // might need some queries/routes
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
    // TODO: fill in correct attributes in Media display
    return (
      <div
        className="detailedView"
        id={this.props.id}
        onClick={this.props.onClick}
      >
        <DetailedView>{this.state.mediaInfo}</DetailedView>

        <h2 style={{ color: "white" }}>Recommendations you might enjoy</h2>
        <div class="card-deck">{0}</div>
      </div>
    );
  }
}
