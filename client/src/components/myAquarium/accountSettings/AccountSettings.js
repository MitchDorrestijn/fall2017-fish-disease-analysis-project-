import React from 'react';
import {Col, Row, Input, InputGroup} from 'reactstrap';
import ActionButton from '../../base/ActionButton';

export default class AccountSettings extends React.Component {
	render() {
		return (
			<div className="account-settings">
				<h1 className="center">Account settings</h1>
				<Col lg={{size: 8, offset: 2}}>
					<div className="settings-box">
						<Col lg="12">
							<h4>User information</h4>
						</Col>
						<Row>
							<Col lg="6">
								Name<br/>
								<Input/>
							</Col>
							<Col lg="6">
								Salutation<br/>
								<Input type="select" name="select" id="exampleSelect" className="custom-select">
									<option>Mr.</option>
									<option>Mrs.</option>
								</Input>
							</Col>
						</Row>
						<Row>
							<Col lg="6">
								Surname<br/>
								<Input/>
							</Col>
							<Col lg="6">
								Date of birth<br/>
								<InputGroup>
									<Input placeholder="dd"/>
									<Input placeholder="mm"/>
									<Input placeholder="yyyy"/>
								</InputGroup>
							</Col>
						</Row>
					</div>
					<div className="settings-box">
						<Col lg="12">
							<h4>Login details</h4>
						</Col>
						<Row>
							<Col lg="6">
								E-mail<br/>
								<Input/>
							</Col>
							<Col lg="6">
								Password<br/>
								<Input type="password"/>
							</Col>
						</Row>
						<Row>
							<Col lg="6"/>
							<Col lg="6">
								Re-enter password<br/>
								<Input type="password"/>
							</Col>
						</Row>
					</div>
					<div className="text-right">
						<ActionButton buttonText="Save changes" color="primary btn-transperant"/>
					</div>
				</Col>
			</div>
		);
	}
}