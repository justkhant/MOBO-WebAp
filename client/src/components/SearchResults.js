import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SearchResults extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="searchResults" id={this.props.id} onClick={this.props.onClick}>
			</div>
		);
	}
}
