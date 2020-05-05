import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Dashboard.css";

export default class FactCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const data = [this.props.id, this.props.title, this.props.genre];
    this.props.goToDetailedView(data);
    return false;
  }

  render() {
    var num = this.props.avg_rating.toFixed(2);
    return (
      <div className="col-md-6 w-25">
        <div className="card flex-md-row mb-4 shadow-sm h-md-250">
          <div className="card-body d-flex flex-column align-items-start">
            <strong className="d-inline-block mb-2 text-success">
              {this.props.genre}
            </strong>
            <h3 className="mb-0">
              <a className="text-dark" href="#" onClick={this.handleClick}>
                {this.props.title}
              </a>
            </h3>
            <div className="mb-1 text-muted">Rating: {num}</div>
            <p className="card-text mb-auto overflow">
              Description: {this.props.desc}
            </p>
            <a href="#" onClick={this.handleClick}>
              More Info
            </a>
          </div>
        </div>
      </div>
    );
  }
}
