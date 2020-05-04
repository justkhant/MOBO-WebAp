import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Dashboard.css";

export default class DetailsView extends React.Component {
  constructor(props) {
    super(props);

    this.onSaveMedia = this.onSaveMedia.bind(this);
  }

  onExit(e) {
    this.props.onExit();
  }

  onSaveMedia() {
    const { data, username } = this.props;

    fetch(`http://localhost:8081/savePage/${username}/${data[0]}` , {
      method: "POST",
    })
      .then(
        (res) => {
          console.log(res.status === 201);
          console.log('add to saved page success');
        },
        (err) => {
          console.log('add to saved page failed');
          console.log(err);
        }
      );
  }

  render() {
    const { data, username } = this.props;

    // BOOK
    if (data[2] == "B") {
      return (
        <section className="jumbotron">
          <button
            type="button"
            class="close"
            aria-label="Close"
            onClick={this.onExit.bind(this)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <img
            src={data[6]}
            className="float-left align-middle"
            alt="Book Cover Image"
            height="250"
            style={{ marginRight: "40px", marginBottom: "30px" }}
          ></img>
          <div className="container">
            <h1 className="jumbotron-heading">{data[1]}</h1>{" "}
            <button type="button" class="btn btn-dark btn-sm" onClick={this.onSaveMedia}>
              <span></span> Save!
            </button>
            <p className="text-muted">
              <strong>Author(s):</strong> {data[12]}
            </p>
            <p className="text-muted">
              <strong>Avg. Rating:</strong> {data[5]}/10 ({data[8]})
            </p>
            <p className="text-muted">
              <strong>Review Count:</strong> {data[14]}
            </p>
            <p className="text-muted">
              <strong>Description:</strong> {data[4]}
            </p>
            <p className="text-muted">
              <strong>Length:</strong> {data[13]} pages
            </p>
          </div>
        </section>
      );
    }
    //MOVIE
    return (
      <section className="jumbotron">
        <button
          type="button"
          class="close"
          aria-label="Close"
          onClick={this.onExit.bind(this)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <img
          src={data[6]}
          className="float-left align-middle"
          alt="Movie Cover Image"
          height="250"
          style={{ marginRight: "40px", marginBottom: "30px" }}
        ></img>
        <div className="container">
          <h1 className="jumbotron-heading">{data[1]}</h1>{" "}
          <button type="button" class="btn btn-dark btn-sm" onClick={this.onSaveMedia}>
            <span></span> Save!
          </button>
          <p className="text-muted">
            <strong>Released:</strong> {data[7]}
          </p>
          <p className="text-muted">
            <strong>Runtime:</strong> {data[10]} minutes
          </p>
          <p className="text-muted">
            <strong>Avg. Rating:</strong> {data[5]}/10 ({data[8]})
          </p>
          <p className="text-muted">
            <strong>Keywords:</strong> {data[3]}
          </p>
          <p className="text-muted">
            <strong>Revenue:</strong> ${data[9]}
          </p>
          <p className="text-muted">
            <strong>Description:</strong> {data[4]}
          </p>
        </div>
      </section>
    );
  }
}
