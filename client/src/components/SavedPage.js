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
  }

  render() {
    const { savedPageMedia } = this.props;
    console.log("saved media contains", savedPageMedia);

    let recDivs = savedPageMedia.map((rec, i) => (
      // TODO: Pass attributes here to FactCard, how to get genre, desc/overview, rating_count?
      // might need some queries/routes
      <FactCard
        id={rec[0]}
        genre={rec[2]}
        title={rec[1]}
        avg_rating={rec[5]}
        desc={rec[4]}
        goToDetailedView={this.props.goToDetailedView}
      />
    ));

    return (
      <div className="Saved Page">
        <h3>My Saved Media</h3>
        <div className="card-deck">{recDivs}</div>
      </div>
    );
  }
}
