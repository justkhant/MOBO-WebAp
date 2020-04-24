import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class DetailedView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="detailedView" id={this.props.id} onClick={this.props.onClick}>
        <p style={{color:'white'}}>I am DetailedView Component</p>
			</div>
		);
	}
}
