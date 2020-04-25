import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchResultsRow from './SearchResultsRow';

export default class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    console.log('data is', data);
    return (
      <div className="searchResults">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Media Type</th>
              <th scope="col">Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => <SearchResultsRow key={i} rowData={row} />)}
          </tbody>
        </table>
      </div>
    );
  }
}
