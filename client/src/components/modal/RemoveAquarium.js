import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Button
} from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';

export default class RemoveAquarium extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			error: null
		}
	}
	removeAquaria = () => {
		let da = new DataAccess();
		da.deleteData(`/aquaria/${this.props.customProps.currentAquarium}`, (err, res) => {
			if (!err) {
				this.props.toggleModal();
				this.props.customProps.reset();
				this.props.customProps.refreshPage();
			} else {
				this.setState({error: 'Something went wrong, please try again.'});
			}
		});
	};
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Remove aquarium</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					Are you sure you want to remove this aquarium?
					<hr/>
					<Button onClick={this.removeAquaria} outline className="modalLink" color="secondary" block>Yes</Button>
					<Button onClick={this.props.toggleModal} outline className="modalLink" color="secondary" block>No</Button>
				</ModalBody>
			</div>
		);
	}
}
