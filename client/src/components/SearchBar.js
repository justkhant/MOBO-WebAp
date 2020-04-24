import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <form class="form-inline active-cyan-3 active-cyan-4">
          <i class="fas fa-search" aria-hidden="true"></i>
          <input class="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search" aria-label="Search" />
        </form>
			</div>
		);
	}
}
