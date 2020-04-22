import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class DetailedView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="detailedView" id={this.props.id} onClick={this.props.onClick}>
			</div>
		);
	}
}
