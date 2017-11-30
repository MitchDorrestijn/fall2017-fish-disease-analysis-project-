import React from 'react';
import { Col } from 'reactstrap';

const SenderBox = (props) => {
  return (
		<Col className="sender-spacing" xs="12">
			<Col className="senderBox" sm="12" md={{ size: 12 }}>
				{props.children}
			</Col>
		</Col>
  );
};

export default SenderBox;
