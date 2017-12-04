import React from 'react';
import {ModalHeader, ModalBody, Button, FormGroup, Label, Input, Form, FormText} from 'reactstrap';
import Error from './Error';

class addNotificationRule extends React.Component {
	addNotificationRule = (e) => {
		e.preventDefault();
		const fishName = e.target.fishName.value;
		const fishDescription = e.target.fishDescription.value;
		const fishSyntoms = e.target.fishSyntoms.value;
		const fishImage = e.target.fishImage.value;
		let allSyntoms = [];
		allSyntoms = fishSyntoms.split(",");
		console.log(`Submitted form data: fishname: ${fishName}, fish description: ${fishDescription}, fish syntoms: ${allSyntoms}, fish image: ${fishImage}`);
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Add fish desise</ModalHeader>
				<ModalBody>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
					<Form onSubmit={this.addNotificationRule}>
						<FormGroup>
							<Label for="Attribute">Attribute:</Label>
							<Input id="attribute" type="select" name="attribute" placeholder="Name of fish" />
						</FormGroup>
						<FormGroup>
							<Label for="Equation">Equation:</Label>
							<Input id="equation" type="select" name="equation" placeholder="Desise synomes" />
						</FormGroup>
						<FormGroup>
							<Label for="Compared">Compared:</Label>
							<Input id="compared" type="number" name="compared" />
						</FormGroup>
						<FormGroup>
							<Label for="Message">Notification message:</Label>
							<Input id="message" type="text" name="message" />
						</FormGroup>
						<Button>Submit</Button>
					</Form>
				</ModalBody>
			</div>
		);
	}
}

export default addNotificationRule;
