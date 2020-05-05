import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Dashboard.css";
import equal from 'fast-deep-equal'

export default class DetailsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaved: false,
      currentMediaID: null,
      savedMedia: [],
    };

    this.onSaveButtonPress = this.onSaveButtonPress.bind(this);
    this.updateSaveValueState = this.updateSaveValueState.bind(this);
  }

  componentDidMount() {
    this.updateSaveValueState();
  }


  componentDidUpdate(prevProps) {
    if(!equal(this.props.savedPageMedia, prevProps.savedPageMedia) || !equal(this.props.data, prevProps.data))
    {
      this.updateSaveValueState();
    }
  }

  onExit(e) {
    this.props.onExit();
  }

  updateSaveValueState() {
    const { data, savedPageMedia } = this.props;

    let isSavedAlready = false;
    console.log('here');
    console.log('data[0]', data[0]);

    for (let i = 0; i < savedPageMedia.length; i++) {
      if (savedPageMedia[i][0] === data[0]) isSavedAlready = true;
    }
    console.log(isSavedAlready);

    this.setState({
      isSaved: isSavedAlready
    });
  }

  onSaveButtonPress() {
    const { data, username, savedPageChanged } = this.props;
    const { isSaved } = this.state;

    console.log('query', username, data[0]);

    if (!isSaved) {
      fetch(`http://localhost:8081/savePage/${username}/${data[0]}`, {
        method: "POST",
      }).then(
        (res) => {
          console.log(res.status === 201);
          console.log("add to saved page success");
          this.setState({
            isSaved: true,
          });
          savedPageChanged();
        },
        (err) => {
          console.log("add to saved page failed");
          console.log(err);
        }
      );
    } else {
      fetch(`http://localhost:8081/deleteSavedPage/${username}/${data[0]}`, {
        method: "PUT",
      }).then(
        (res) => {
          console.log('status', res.status === 200);
          console.log("deleted from saved page");
          this.setState({
            isSaved: false,
          });
          savedPageChanged();
        },
        (err) => {
          console.log("delete from saved page failed");
          console.log(err);
        }
      );
    }

  }

  render() {
    const { username, data } = this.props;

    //MOVIE
    let num = data[5];

    if (num !== undefined) num = data[5].toFixed(2);

    let saveButton = (username === null) ? [] : (this.state.isSaved) ? (<button id="saveButton" type="button" class="btn-sm save" onClick={this.onSaveButtonPress}><span></span> Saved! </button>) :
     (<button id="saveButton" type="button" class="btn btn-dark btn-sm" onClick={this.onSaveButtonPress}> <span></span> Save </button>);


    if (data[2] === "B") {
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
            {saveButton} {/* SAVE BUTTON HERE */}
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

    // MOVIE
    let date = data[7];
    if (date !== undefined && data[2] === "M") date = date.substring(0, 10);
    return (
      <section className="jumbotron">
        <button
          type="button"
          className="close"
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
          {saveButton} {/* SAVE BUTTON HERE */}
          <p className="text-muted">
            <strong>Released:</strong> {date}
          </p>
          <p className="text-muted">
            <strong>Runtime:</strong> {data[10]} minutes
          </p>
          <p className="text-muted">
            <strong>Avg. Rating:</strong> {num}/10 ({data[8]})
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
