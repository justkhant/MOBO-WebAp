import React from "react";
import "../style/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import FactCard from "./FactCard";

export default class FunFact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSearchTerm: null,
      searchResultsData: [],
      detailedViewData: null,
      isDetailedView: false,
      selectedRow: 0,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // TODO: Fetch data for interesting facts section
  }

  fetchData(searchData) {
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

          this.setState({
            searchResultsData: searchResult.rows,
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }



  render() {
    const { searchResultsData, detailedViewData, isDetailedView, selectedRow } = this.state;


    return (
      <div className="Funfact">
        <div class="container">
        <div class="row">
        <div class="col-4">
            <div class="list-group" id="list-tab" role="tablist">
            <a class="list-group-item list-group-item-action active" id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="home">What is the shortest movie ever?</a>
            <a class="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-profile" role="tab" aria-controls="profile">What is the longest movie ever?</a>
            <a class="list-group-item list-group-item-action" id="list-messages-list" data-toggle="list" href="#list-messages" role="tab" aria-controls="messages">Who has written the most books?</a>
            <a class="list-group-item list-group-item-action" id="list-settings-list" data-toggle="list" href="#list-settings" role="tab" aria-controls="settings">What was the most profittable movie?</a>
            </div>
        </div>
        <div class="col-8">
            <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="list-home" role="tabpanel" aria-labelledby="list-home-list"><FactCard/></div>
            <div class="tab-pane fade" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list"><FactCard/></div>
            <div class="tab-pane fade" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list"><FactCard/></div>
            <div class="tab-pane fade" id="list-settings" role="tabpanel" aria-labelledby="list-settings-list"><FactCard/></div>
            </div>
        </div>
        </div>
        </div>
      </div>
    );
  }
}
