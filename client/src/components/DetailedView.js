import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FactCard from "./FactCard";
import DetailsView from "./DetailsView";
import testData from "../testData";

export default class DetailedView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaInfo: [],
      recMedia: [],
    };

    this.getRecommendations = this.getRecommendations.bind(this);
    this.getMediaDetails = this.getMediaDetails.bind(this);
  }

  componentDidMount() {
    this.getMediaDetails();
    this.getRecommendations();
  }

  //TODO: get's media's info based on media_id
  getMediaDetails() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/media/" + this.props.data[0], {
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
          console.log(info.rows[0]);
          this.setState({
            mediaInfo: info.rows[0],
          });
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      );
  }

  //TODO: get a list of recommendations + create FactCards
  getRecommendations() {
    // Send an HTTP request to the server.
    var searchPath = [this.props.data[2], this.props.data[0]].join("/");

    fetch("http://localhost:8081/recommendations/" + searchPath, {
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
          console.log("This is recs list");
          console.log(recList);
          let recDivs = recList.rows.map((rec, i) => (
            // TODO: Pass attributes here to FactCard, how to get genre, desc/overview, rating_count?
            // might need some queries/routes
            <FactCard
              id={rec[0]}
              genre={rec[2]}
              title={rec[1]}
              avg_rating={rec[6]}
              desc={rec[5]}
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

  onExit() {
    this.props.onExit();
  }

  render() {
    return (
      <div
        className="detailedView"
        id={this.props.id}
        onClick={this.props.onClick}
      >
        <DetailsView
          data={this.state.mediaInfo}
          onExit={this.onExit.bind(this)}
          username={this.props.username}
        ></DetailsView>

        <h3 style={{ color: "#ff843c", marginBottom: "20px" }}>
          Recommendations you might enjoy
        </h3>
        <div class="card-deck">{this.state.recMedia}</div>
      </div>
    );
  }
}
