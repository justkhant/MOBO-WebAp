import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Dashboard.css";
import SearchResultsRow from "./SearchResultsRow";

export default class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <div className="searchResults">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Media Type</th>
              <th scope="col">Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <SearchResultsRow
                key={i}
                rowData={row}
                rowIndex={i}
                showDetailedView={this.props.showDetailedView}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
