import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const genreOptions = ['All', 'History', 'Romance', 'Comedy', 'Documentary', 'Sports'];

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      selectedGenre : 'All',
    }

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(event) {
    event.preventDefault();

    const searchData = {
      searchTerm: this.state.searchTerm,
      genre: this.state.selectedGenre,
    }
    
    this.props.search(searchData);
  }

  render() {

    console.log('search term is', this.state.searchTerm);

    return (
      <div>
        <form className="form-inline active-cyan-3 active-cyan-4" onSubmit={this.handleSearch}>
          <i className="fas fa-search" aria-hidden="true"></i>
          <input className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search" aria-label="Search" onChange={(e) => this.setState({searchTerm: e.target.value})}/>
          <div className="form-group">
          <label>Genres</label>
          <select className="form-control" id="GenreSelect" onChange={(e) => this.setState({selectedGenre: e.target.value})}>
            {genreOptions.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
          </select>
        </div>
        </form>
			</div>
		);
	}
}
