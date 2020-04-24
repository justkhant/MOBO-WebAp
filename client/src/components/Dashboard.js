import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import DetailedView from './DetailedView';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSearchTerm: null,
      searchResultsData: null,
      detailedViewData: null, 
      isDetailedView: false,
    }

    this.search = this.search.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // TODO: Fetch data for interesting facts section
    
  }

  search(term) {
    // TODO: Fetch data for search term, onClick/onSubmit for SearchBar
  }

  render() {
    const { searchResultsData, detailedViewData, isDetailedView } = this.state;

    if (isDetailedView) {
      return (
        <div className="Dashboard">
          <h1>Is DetailedView</h1>
          <br></br>
          <SearchBar />
          <DetailedView data={detailedViewData} />
        </div>
      );
    }

    return (
      <div className="Dashboard">
        <h1>Not DetailedView</h1>
        <br></br>
        <SearchBar />
        <SearchResults data={searchResultsData} />
      </div>
    );
  }
}