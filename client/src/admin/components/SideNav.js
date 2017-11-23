import React from 'react';
import { ListGroup, ListGroupItem, Col, Row } from 'reactstrap';

export default class SideNav extends React.Component {
  render() {
    return (
			<Row>
				<Col md="3 admin-sidebar">
		      <ListGroup>
		        <ListGroupItem disabled tag="a" href="#">Cras justo odio</ListGroupItem>
		        <ListGroupItem tag="a" href="#">Dapibus ac facilisis in</ListGroupItem>
		        <ListGroupItem tag="a" href="#">Morbi leo risus</ListGroupItem>
		        <ListGroupItem tag="a" href="#">Porta ac consectetur ac</ListGroupItem>
		        <ListGroupItem tag="a" href="#">Vestibulum at eros</ListGroupItem>
		      </ListGroup>
				</Col>
			</Row>
    );
  }
}
