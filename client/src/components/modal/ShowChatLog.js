import React from 'react';
import { ModalHeader, ModalBody, Table} from 'reactstrap';
import 'react-select/dist/react-select.css';
import * as firebase from 'firebase';

export default class ShowChatLog extends React.Component {
	constructor(props){
		super(props);
		this.chatLog = null;
		this.chatLogArray = [];
	}
	componentDidMount(){
		this.chatLog = this.props.customProps.chatLog;
		this.chatLog.forEach((log) => {
			let isThisUser = log.userId === firebase.auth().currentUser.uid;
			this.chatLogArray.push(<tr><td>{isThisUser?<strong>{log.time}</strong>:log.time}</td><td>{isThisUser?<strong>{log.name}</strong>:log.name}</td><td>{log.message}</td></tr>);
		});
	}
	
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Appointment: {this.props.customProps.timeSlot}</ModalHeader>
				<ModalBody>
					<Table bordered>
						<tbody>
							{this.chatLogArray}
						</tbody>
					</Table>
				</ModalBody>
			</div>
		);
	}
}
