import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class SearchResultsRow extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.showDetailedView(this.props.rowIndex);
  }

  render() {
    const { rowData } = this.props;
    var num = rowData[3].toFixed(2);
    return (
      <tr className="searchResultsRow" onClick={this.handleClick}>
        <th scope="row">{rowData[1]}</th>
        <td>{rowData[2]}</td>
        <td>{num}</td>
      </tr>
    );
  }
}
