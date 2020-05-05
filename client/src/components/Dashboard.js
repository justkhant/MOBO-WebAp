import React from "react";
import "../style/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import DetailedView from "./DetailedView";
import FactCard from "./FactCard";
import FunFact from "./FunFact";
import FactsLanding from "./FactsLanding";
import LoginModal from "./LoginModal";
import SavedPage from "./SavedPage";

import testData from "../testData";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSearchTerm: null,
      searchResultsData: [],
      detailedViewData: null,
      isDetailedView: false,
      selectedRow: 0,
      showModal: false,
      loading: false,
      error: null,
      loggedInUser: "bill",
      showSavePage: false,
      fact1: null,
      fact2: null,
      fact3: null,
      fact4: null,
    };

    this.search = this.search.bind(this);
    this.showDetailedView = this.showDetailedView.bind(this);
    this.hideDetailedView = this.hideDetailedView.bind(this);
    this.onLoginAttemptSuccess = this.onLoginAttemptSuccess.bind(this);
    this.toggleSavedPage = this.toggleSavedPage.bind(this);
    this.funFact1 = this.funFact1.bind(this);
    this.funFact2 = this.funFact2.bind(this);
    this.funFact3 = this.funFact3.bind(this);
    this.funFact4 = this.funFact4.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // TODO: Fetch data for interesting facts section
    this.funFact1();
    this.funFact2();
    this.funFact3();
    this.funFact4();
  }

  funFact1() {
    fetch("http://localhost:8081/funfact1", {
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
        (fact1) => {
          if (!fact1) return;
          console.log("Fun fact 1!!!");
          console.log(fact1);
          this.setState({
            fact1: fact1.rows[0],
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  funFact2() {
    fetch("http://localhost:8081/funfact2", {
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
        (fact2) => {
          if (!fact2) return;
          console.log("Fun fact 2!!!");
          console.log(fact2);
          this.setState({
            funFact2: fact2.rows[0],
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  funFact3() {
    fetch("http://localhost:8081/funfact3", {
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
        (fact3) => {
          if (!fact3) return;
          console.log("Fun fact 3!!!");
          console.log(fact3);
          this.setState({
            funFact3: fact3.rows[0],
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  funFact4() {
    fetch("http://localhost:8081/funfact4", {
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
        (fact4) => {
          if (!fact4) return;
          console.log("Fun fact 4!!!");
          console.log(fact4);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  search(searchData) {
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

  showDetailedView(rowIndex) {
    this.setState({
      detailedViewData: testData,
      isDetailedView: true,
      selectedRow: rowIndex,
    });
  }

  hideDetailedView() {
    this.setState({
      isDetailedView: false,
    });
  }

  onLoginAttemptSuccess(user) {
    console.log("login success for" + user.email);
    this.setState({
      loggedInUser: user,
    });
  }

  onExit() {
    this.setState({
      isDetailedView: false,
      currentSearchTerm: null,
      searchResultsData: [],
    });
  }

  toggleSavedPage() {
    const newState = !this.state.showSavePage;
    console.log("showSavedPage is", newState);
    this.setState({
      showSavePage: newState,
    });
  }

  render() {
    const {
      searchResultsData,
      detailedViewData,
      isDetailedView,
      selectedRow,
      loggedInUser,
      showSavePage,
      fact1,
    } = this.state;

    let loginSection =
      loggedInUser === null ? (
        <div>
          {" "}
          <LoginModal onLoginAttemptSuccess={this.onLoginAttemptSuccess} />{" "}
        </div>
      ) : (
        <p>Hello {loggedInUser}</p>
      );

    let savedPageButton =
      loggedInUser === null ? (
        []
      ) : (
        <form
          className="navbar-nav mr-auto"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <button className="btn-1" onClick={this.toggleSavedPage}>
            Saved Page
          </button>
        </form>
      );

    if (showSavePage) {
      return (
        <div className="Dashboard">
          <div class="container">
            <nav class="navbar navbar-expand-lg navbar-light">
              <a class="navbar-brand" href="#">
                <img src="mobo_logo.png" height="70"></img>
              </a>
              <div class="navbar-collapse collapse justify-content-between"></div>
              <form className="navbar-nav mr-auto">{loginSection}</form>
              <form
                className="navbar-nav mr-auto"
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                <button className="btn-1" onClick={this.toggleSavedPage}>
                  Home Page
                </button>
              </form>
            </nav>
            <br></br>
            <SavedPage username={loggedInUser} />
          </div>
        </div>
      );
    }

    if (isDetailedView) {
      return (
        <div className="Dashboard">
          <div class="container">
            <nav class="navbar navbar-expand-lg navbar-light">
              <a class="navbar-brand" href="#">
                <img src="mobo_logo.png" height="70"></img>
              </a>
              <div class="navbar-collapse collapse justify-content-between"></div>
              <form
                className="navbar-nav mr-auto"
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                {loginSection}
              </form>
              {savedPageButton}
            </nav>
            <br></br>
            <SearchBar search={this.search} />
            <DetailedView
              data={searchResultsData[selectedRow]}
              username={loggedInUser}
              onExit={this.onExit.bind(this)}
            />
          </div>
        </div>
      );
    }

    if (searchResultsData.length == 0) {
      return (
        <div className="Dashboard">
          <div class="container">
            <nav class="navbar navbar-expand-lg navbar-light">
              <a class="navbar-brand" href="#">
                <img src="mobo_logo.png" height="70"></img>
              </a>
              <div class="navbar-collapse collapse justify-content-between"></div>
              <form
                className="navbar-nav mr-auto"
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                {loginSection}
              </form>
              {savedPageButton}
            </nav>
            <br></br>
            <SearchBar search={this.search} />
            <br></br>
            <FactsLanding fact1={fact1} />
          </div>
        </div>
      );
    }

    return (
      <div className="Dashboard">
        <div class="container">
          <nav class="navbar navbar-expand-lg navbar-light">
            <a class="navbar-brand" href="#">
              <img src="mobo_logo.png" height="70"></img>
            </a>
            <div class="navbar-collapse collapse justify-content-between"></div>
            <form
              className="navbar-nav mr-auto"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              {loginSection}
            </form>
            {savedPageButton}
          </nav>
          <br></br>
          <SearchBar search={this.search} />
          <SearchResults
            data={searchResultsData}
            showDetailedView={this.showDetailedView}
          />
          <br></br>
        </div>
      </div>
    );
  }
}
