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
	removeFish = () => {
		let da = new DataAccess();
		da.deleteData (`/aquaria/${this.props.customProps.currentAquarium}/species/${this.props.customProps.fishId}`, (err, res) => {
			if (!err) {
				this.props.toggleModal();
				this.props.customProps.refreshPage();
			} else {
				this.setState({error: 'Something went wrong, please try again.'});
			}
		});
	};
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Remove fish</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					Remove the {this.props.customProps.fishName} from your aquarium?
					<hr/>
					<Button onClick={this.removeFish} outline className="modalLink" color="secondary" block>Yes</Button>
					<Button onClick={this.props.toggleModal} outline className="modalLink" color="secondary" block>No</Button>
				</ModalBody>
			</div>
		);
	}
}