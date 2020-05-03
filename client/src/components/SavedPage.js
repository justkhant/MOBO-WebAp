import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class SavedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      savedMedia: [],
    };
  }

  componentDidMount() {
    fetch("http://localhost:8081/media/" + 10554, {
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
        (info) => {
          if (!info) return;
          console.log(info.rows);
          this.setState({
            savedMedia: info.rows,
          });
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
