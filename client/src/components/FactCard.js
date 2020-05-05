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
    return (
      <div class="col-md-6 w-25">
        <div class="card flex-md-row mb-4 shadow-sm h-md-250">
          <div class="card-body d-flex flex-column align-items-start">
            <strong class="d-inline-block mb-2 text-success">
              {this.props.genre}
            </strong>
            <h3 class="mb-0">
              <a class="text-dark" href="#" onClick={this.handleClick}>
                {this.props.title}
              </a>
            </h3>
            <div class="mb-1 text-muted">Rating: {this.props.avg_rating}</div>
            <p class="card-text mb-auto overflow">
              Description: {this.props.desc}
            </p>
            <a href="#" onClick={this.handleClick}>More Info</a>
          </div>
        </div>
      </div>
    );
  }
}
