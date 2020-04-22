import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import SearchBar from './SearchBar';
import DashboardMovieRow from './DashboardMovieRow';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSearch: null,
      searchResults: null,
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
    // TODO: Fetch data for search term
  }

  render() {
    const { detailedViewData, isDetailedView } = this.state;

    if (isdetailedView) {
      return (
        <div className="Dashboard">
          <PageNavbar active="dashboard" />
          <br></br>
          <DetailedView data={detailedViewData} />
  
        </div>
      );
    }
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />
        <br></br>

      </div>
    );
  }
}