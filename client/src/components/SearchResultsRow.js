import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    return (
      <tr className="searchResultsRow" onClick={this.handleClick}>
        <th scope="row">{rowData[1]}</th>
        <td>{rowData[5]}</td>
        <td>{rowData[4]}</td>
      </tr>
    );
  }
}
