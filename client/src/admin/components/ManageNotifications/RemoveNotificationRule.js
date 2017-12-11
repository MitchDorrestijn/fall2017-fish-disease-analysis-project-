import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class RemoveNotificationRule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.customProps.entry
		};
	};

	deleteNotificationRule = () => {
		let da = new DataAccess ();
		console.log(this.state.data);
		da.deleteData(`/notifications/rules/${this.state.data.id}`, (err, res) => {
			if (!err) {
				this.props.customProps.refreshPage();
				this.props.toggleModal();
			} else {
				console.log(err);
			};
		});
	};

	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Remove notification rule</ModalHeader>
				<ModalBody>
					Are you sure you want to remove this notification rule?
					<hr/>
					<Button onClick={this.deleteNotificationRule} outline className='modalLink' color='secondary' block>Yes</Button>
					<Button onClick={this.props.toggleModal} outline className='modalLink' color='secondary' block>No</Button>
				</ModalBody>
			</div>
		);
	}
}
