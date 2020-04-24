import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class FactCard extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="factCard" id={this.props.id}>
        <p>I'm a fact card</p>
			</div>
		);
	}
}
