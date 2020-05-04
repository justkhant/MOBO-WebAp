import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FactCard from "./FactCard";

const testIds = [10554, 7556, 88050];
const testIdsString = "10554,7556,88050";

export default class SavedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      savedMedia: [],
      displayMedia: [],
    };

    this.getSavedMediaFromUsername = this.getSavedMediaFromUsername.bind(this);
    this.getMediaDataFromMediaIDs = this.getMediaDataFromMediaIDs.bind(this);
  }

  componentDidMount() {
    const username = this.props.username;

    if (username === null) return;

    this.getSavedMediaFromUsername(username);
  }

  getSavedMediaFromUsername(username) {
    fetch(`http://localhost:8081/getSavedPage/${username}`, {
      method: "GET",
    })
      .then(
        (res) => {
          console.log(res);
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then(
        (res) => {
          this.getMediaDataFromMediaIDs(res.rows);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getMediaDataFromMediaIDs(media_ids) {
    fetch(
      `http://localhost:8081/mediaMultiple?media_ids=${JSON.stringify(
        media_ids
      )}`,
      {
        method: "GET",
      }
    )
      .then(
        (res) => {
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then(
        (res) => {
          let recDivs = res.rows.map((rec, i) => (
            // TODO: Pass attributes here to FactCard, how to get genre, desc/overview, rating_count?
            // might need some queries/routes
            <FactCard
              id={rec[0]}
              genre={rec[2]}
              title={rec[1]}
              avg_rating={rec[5]}
              desc={rec[4]}
            />
          ));
          this.setState({
            savedMedia: [res.rows],
            displayMedia: recDivs,
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  render() {
    const { savedMedia } = this.state;
    console.log("saved media contains", savedMedia);

    return (
      <div class="Saved Page">
        <h3>My Saved Media</h3>
        <div class="card-deck">{this.state.displayMedia}</div>
      </div>
    );
  }
}
