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
    this.getSavedMediaFromUsername(this.props.username);
  }

  getSavedMediaFromUsername(username) {

  }

  getMediaDataFromMediaIDs(media_ids) {
    fetch(`http://localhost:8081/mediaMultiple?media_ids=${JSON.stringify(testIds)}`, {
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
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  render() {
    return (
      <div class="Saved Page">
        <p>Saved Page</p>
      </div>
    );
  }
}
