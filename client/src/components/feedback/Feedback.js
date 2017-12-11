import React from 'react';
import {
	Alert
} from 'reactstrap';

export default class Feedback extends React.Component {
	render() {
		return (
			<Alert className="feedbackAlert" color={this.props.feedbackColor} isOpen={this.props.showFeedback} toggle={this.props.closeFeedback}>
				<p>{this.props.feedbackContent}</p>
			</Alert>
		);
	}
}
