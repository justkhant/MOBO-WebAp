import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSearchTerm: null,
      searchResultsData: null,
      detailedViewData: null, 
      isDetailedView: false,
    }

    this.searchTerm = this.searchTerm.bind(this);
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
          <br></br>
          <SearchBar />
          <DetailedView data={detailedViewData} />
        </div>
      );
    }

    return (
      <div className="Dashboard">
        <PageNavbar active="dashboard" />
        <br></br>
        <SearchBar />
        <SearchResults data={searchResultsData} />
      </div>
    );
  }
}