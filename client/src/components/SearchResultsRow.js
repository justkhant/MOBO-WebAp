import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SearchResultsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="searchResultsRow" id={this.props.id} onClick={this.props.onClick}>
			</div>
		);
	}
}
