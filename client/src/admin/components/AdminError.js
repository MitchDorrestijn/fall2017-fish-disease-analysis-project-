import React from 'react';
import {Col, Row, Alert} from 'reactstrap';

const AdminError = () => {
	return (
		<Row>
			<Col lg={{size: 6, offset: 3}}>
				<div className="body-margin-top">
					<Alert color="danger" className="text-center">
						You are not allowed to enter the admin area.
					</Alert>
				</div>
			</Col>
		</Row>
	);
};

export default AdminError;