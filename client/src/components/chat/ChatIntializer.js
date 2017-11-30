import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Senderbox from './Senderbox.js';
import Recieverbox from './Recieverbox.js';

export default class ChatIntializer extends React.Component {
	render(){
  	return (
			<div className="chat-wrapper">
				<Container>
					<Row>
						<Senderbox>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Senderbox>
						<Senderbox>Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Senderbox>
						<Recieverbox>aaaaaa</Recieverbox>
					</Row>
				</Container>
			</div>
  	);
	}
};
