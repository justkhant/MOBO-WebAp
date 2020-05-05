import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Dashboard.css";

const genreOptions = ["No", "Yes"];
const mediaOptions = ["All", "Books", "Movies"];

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "",
      advancedSearch: "No",
      selectedGenre: "All",
      selectedMedia: "All",
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(event) {
    event.preventDefault();

    const searchData = {
      searchTerm: this.state.searchTerm,
      genre: this.state.selectedGenre,
      media: this.state.selectedMedia,
    };

    this.props.search(searchData);
  }

  render() {
    return (
      <div>
        <form
          className="form-inline active-cyan-3 active-cyan-4"
          onSubmit={this.handleSearch}
        >
          <i className="fas fa-search" aria-hidden="true"></i>
          <input
            className="form-control form-control-sm ml-3 w-50"
            type="text"
            placeholder="Search for a book or movie!"
            aria-label="Search"
            onChange={(e) => this.setState({ searchTerm: e.target.value })}
          />
          <input type="submit" className="btn-1" value="Search" />
          <div className="form-group">
            <label className="search-filters">Advanced?</label>
            <select
              className="form-control"
              id="Advanced Search"
              onChange={(e) =>
                this.setState({ advancedSearch: e.target.value })
              }
            >
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <label className="search-filters">Mo/Bo?</label>
            <select
              className="form-control"
              id="MediaSelect"
              onChange={(e) => this.setState({ selectedMedia: e.target.value })}
            >
              {mediaOptions.map((media) => (
                <option key={media} value={media}>
                  {media}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
    );
  }
}
