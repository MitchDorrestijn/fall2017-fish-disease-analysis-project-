import React from 'react';
import {Link, BrowserRouter, Switch} from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

export default class Footer extends React.Component {
	render(){
		return(
			<Container fluid className="footer">
				<Row>
      		<Col><Link to="/bassleer">Bassleer</Link></Col>
      		<Col><Link to="/terms">Terms & conditions</Link></Col>
      		<Col><Link to="/contact">Contact</Link></Col>
        </Row>
			</Container>
		);
	}
}
