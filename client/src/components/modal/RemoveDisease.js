import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody} from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';

export default class RemoveDisease extends Component {
	removeDisease = () => {
		console.log(`/diseases/${this.props.customProps.entry.id}`);

		let da = new DataAccess();
		da.deleteData(`/diseases/${this.props.customProps.entry.id}`, (err, res) => {
			if (!err) {
				this.props.toggleModal();
				this.props.customProps.refreshPage();

			} else {
				console.log('error');
			}
		});
	};

	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Remove Disease</ModalHeader>
				<ModalBody>
					Are you sure you want to remove this disease?
					<hr/>
					<Button onClick={this.removeDisease} outline className="modalLink" color="secondary" block>Yes</Button>
					<Button onClick={this.props.toggleModal} outline className="modalLink" color="secondary" block>No</Button>
				</ModalBody>
			</div>
		);
	}
}
