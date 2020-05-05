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

import Cookies from 'js-cookie';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSearchTerm: null,
      searchResultsData: [],
      isDetailedView: false,
      selectedData: null,
      showModal: false,
      loading: false,
      error: null,
      loggedInUser: null,
      showSavePage: false,
      savedPageMedia: [],
      fact1: null,
      fact2: null,
      fact3: null,
      fact4: null,
    };

    this.search = this.search.bind(this);
    this.showDetailedView = this.showDetailedView.bind(this);
    this.hideDetailedView = this.hideDetailedView.bind(this);
    this.onLoginAttemptSuccess = this.onLoginAttemptSuccess.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleSavedPage = this.toggleSavedPage.bind(this);
    this.funFact1 = this.funFact1.bind(this);
    this.funFact2 = this.funFact2.bind(this);
    this.funFact3 = this.funFact3.bind(this);
    this.funFact4 = this.funFact4.bind(this);
    this.getSavedMediaFromUsername = this.getSavedMediaFromUsername.bind(this);
    this.getMediaDataFromMediaIDs = this.getMediaDataFromMediaIDs.bind(this);
    this.onExit = this.onExit.bind(this);
    this.goToDetailedView = this.goToDetailedView.bind(this);
    this.savedPageChanged = this.savedPageChanged.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // TODO: Fetch data for interesting facts section
    this.funFact1();
    this.funFact2();
    this.funFact3();
    this.funFact4();

    let username = Cookies.get('username');
    if (username !== undefined) {
      this.setState({
        loggedInUser: username,
      }, () => {this.getSavedMediaFromUsername(username);})
    }
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

          this.setState({
            fact2: [fact2.rows],
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
          this.setState({
            fact3: fact3.rows[0],
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
          this.setState({
            fact4: fact4.rows[0],
          });
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
            isDetailedView: false,
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  showDetailedView(rowIndex) {
    const { searchResultsData } = this.state;
    this.setState({
      isDetailedView: true,
      selectedData: searchResultsData[rowIndex],
    });
  }

  hideDetailedView() {
    this.setState({
      isDetailedView: false,
    });
  }

  onLoginAttemptSuccess(username) {
    console.log("login success for" + username);
    this.getSavedMediaFromUsername(username);
  }

  handleLogout() {
    Cookies.remove('username');
    this.setState({
      loggedInUser: null,
    }, this.savedPageChanged)
  }

  onExit() {
    this.setState({
      isDetailedView: false,
    });
  }

  toggleSavedPage() {
    const newState = !this.state.showSavePage;

    this.setState({
      showSavePage: newState,
      currentSearchTerm: null,
      searchResultsData: [],
    });
  }

  getSavedMediaFromUsername(username) {
    if (username === null) {
      this.setState({
        savedPageMedia: [],
      });
    }
    fetch(`http://localhost:8081/getSavedPage/${username}`, {
      method: "GET",
    })
      .then(
        (res) => {
          console.log(res);
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then(
        (res) => {
          this.getMediaDataFromMediaIDs(username, res.rows);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getMediaDataFromMediaIDs(username, media_ids) {
    fetch(
      `http://localhost:8081/mediaMultiple?media_ids=${JSON.stringify(
        media_ids
      )}`,
      {
        method: "GET",
      }
    )
      .then(
        (res) => {
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then(
        (res) => {
          this.setState({
            savedPageMedia: res.rows,
            loggedInUser: username,
          });
        },
        (err) => {
          console.log(err);
        }
      );
  }

  goToDetailedView(data) {
    console.log('is in goToDetailedView, id is', data);

    this.setState({
      showSavePage: false,
      isDetailedView: true,
      selectedData: data,
    });
  }

  savedPageChanged() {
    this.getSavedMediaFromUsername(this.state.loggedInUser);
  }


  render() {
    const {
      searchResultsData,
      isDetailedView,
      selectedData,
      loggedInUser,
      showSavePage,
      savedPageMedia,
      fact1,
    } = this.state;

    let loginSection = (<div> {" "}<LoginModal username={loggedInUser} onLoginAttemptSuccess={this.onLoginAttemptSuccess} handleLogout={this.handleLogout} />{" "} </div>);

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
          <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light">
              <a className="navbar-brand" href="#">
                <img src="mobo_logo.png" height="70"></img>
              </a>
              <div className="navbar-collapse collapse justify-content-between"></div>
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
            <SavedPage username={loggedInUser} savedPageMedia={savedPageMedia} goToDetailedView={this.goToDetailedView}/>
          </div>
        </div>
      );
    }

    if (isDetailedView) {
      return (
        <div className="Dashboard">
          <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light">
              <a className="navbar-brand" href="#">
                <img src="mobo_logo.png" height="70"></img>
              </a>
              <div className="navbar-collapse collapse justify-content-between"></div>
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
              data={selectedData}
              username={loggedInUser}
              savedPageMedia={savedPageMedia}
              onExit={this.onExit}
              goToDetailedView={this.goToDetailedView}
              savedPageChanged={this.savedPageChanged}
            />
          </div>
        </div>
      );
    }

    if (searchResultsData.length === 0) {
      return (
        <div className="Dashboard">
          <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light">
              <a className="navbar-brand" href="#">
                <img src="mobo_logo.png" height="70"></img>
              </a>
              <div className="navbar-collapse collapse justify-content-between"></div>
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
            <FactsLanding
              fact1={this.state.fact1}
              fact2={this.state.fact2}
              fact3={this.state.fact3}
              fact4={this.state.fact4}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="Dashboard">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light">
            <a className="navbar-brand" href="#">
              <img src="mobo_logo.png" height="70"></img>
            </a>
            <div className="navbar-collapse collapse justify-content-between"></div>
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
