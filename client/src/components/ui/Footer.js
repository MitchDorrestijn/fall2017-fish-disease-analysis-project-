import React from 'react';
import {Link} from 'react-router-dom';
import {Container, Row, Col} from 'reactstrap';
import Translate from 'translate-components';

export default class Footer extends React.Component {
	render() {
		return (
			<Container fluid className="footer">
				<Row>
					<Col><Link to="/bassleer"><Translate>Bassleer</Translate></Link></Col>
					<Col><Link to="/terms"><Translate>Terms & conditions</Translate></Link></Col>
					<Col><Link to="/contact"><Translate>Contact</Translate></Link></Col>
				</Row>
			</Container>
		);
	}
}
