import React from "react";
import "../style/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import DetailedView from "./DetailedView";
import FactCard from "./FactCard";

import testData from "../testData";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSearchTerm: null,
      searchResultsData: {},
      detailedViewData: null,
      isDetailedView: false,
    };

    this.search = this.search.bind(this);
    this.showDetailedView = this.showDetailedView.bind(this);
    this.hideDetailedView = this.hideDetailedView.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // TODO: Fetch data for interesting facts section
  }

  search(searchData) {
    // TODO: Fetch data for search term, onClick/onSubmit for SearchBar
    var searchPath = [
      searchData.media,
      searchData.genre,
      searchData.searchTerm,
    ].join("/");
    console.log(searchPath);

    fetch("http://localhost:8081/search/" + searchPath, {
      method: "GET",
    })
      .then(
        (res) => {
          // Convert the response data to a JSON.
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then(
        (searchResult) => {
          if (!searchResult) return;
          console.log(searchResult);

          this.setState({
            searchResultsData: searchResult,
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  showDetailedView(rowIndex) {
    console.log(rowIndex);

    this.setState({
      detailedViewData: testData,
      isDetailedView: true,
    });
  }

  hideDetailedView() {
    this.setState({
      isDetailedView: false,
    });
  }

  render() {
    const { searchResultsData, detailedViewData, isDetailedView } = this.state;

    if (isDetailedView) {
      return (
        <div className="Dashboard">
          <h1 style={{ color: "white" }}>Is DetailedView</h1>
          <br></br>
          <SearchBar search={this.search} />
          <Button variant="primary" onClick={this.hideDetailedView}>
            Hide Detailed View
          </Button>{" "}
          <DetailedView data={detailedViewData[0]} />
        </div>
      );
    }

    return (
      <div className="Dashboard">
        <h1 style={{ color: "white" }}>Not DetailedView</h1>
        <br></br>
        <SearchBar search={this.search} />
        <Button variant="primary" onClick={this.showDetailedView}>
          Show Detailed View
        </Button>{" "}
        <SearchResults
          data={testData}
          showDetailedView={this.showDetailedView}
        />
      </div>
    );
  }
}
