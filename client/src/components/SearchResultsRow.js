import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SearchResultsRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { rowData } = this.props;

    return (
      <tr className="searchResultsRow">
        <th scope="row">{rowData.title}</th>
        <td>{rowData.media_type}</td>
        <td>{rowData.avg_rating}</td>
      </tr>
    );
  }
}
