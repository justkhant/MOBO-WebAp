import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const testIds = [10554, 7556, 88050];
const testIdsString = '10554,7556,88050';

export default class SavedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      savedMedia: [],
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
          this.getMediaDataFromMediaIDs(res.rows)
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getMediaDataFromMediaIDs(media_ids) {
    fetch(`http://localhost:8081/mediaMultiple?media_ids=${JSON.stringify(media_ids)}`, {
      method: "GET",
    })
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
          console.log(res.rows);
          this.setState({
            savedMedia: [res.rows],
          })
        },
        (err) => {
          console.log(err);
        }
      );
  }

  render() {
    const { savedMedia } = this.state;
    console.log(savedMedia);

    return (
      <div class="Saved Page">
        <p>Saved Page</p>
      </div>
    );
  }
}
