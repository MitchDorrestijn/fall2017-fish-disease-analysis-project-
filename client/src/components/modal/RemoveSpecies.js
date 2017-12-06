import React from 'react';
import {Button, ModalHeader, ModalBody} from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';

export default class RemoveSpecies extends React.Component {
	removeSpecies = () => {
		let da = new DataAccess();
		da.deleteData(`/species/${this.props.customProps.entry.id}`, (err, res) => {
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
				<ModalHeader toggle={() => this.props.toggleModal()}>Remove species</ModalHeader>
				<ModalBody>
					Are you sure you want to remove this species?
					<hr/>
					<Button onClick={this.removeSpecies} outline className="modalLink" color="secondary" block>Yes</Button>
					<Button onClick={this.props.toggleModal} outline className="modalLink" color="secondary" block>No</Button>
				</ModalBody>
			</div>
		);
	}
}
