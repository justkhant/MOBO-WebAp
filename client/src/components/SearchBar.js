import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SearchBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="searchBar" id={this.props.id} onClick={this.props.onClick}>
			</div>
		);
	}
}
