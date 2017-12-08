import React from 'react';
import { Col } from 'reactstrap';

const ReceiverBox = (props) => {
  return (
		<Col className="receiver-spacing" sm="12">
			<Col className="receiverBox" sm="12" md={{ size: 8, offset: 2 }}>
				{props.children}
			</Col>
		</Col>
  );
};

export default ReceiverBox;
