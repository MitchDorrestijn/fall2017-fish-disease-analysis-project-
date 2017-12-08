import React from 'react';
import { Col } from 'reactstrap';

const RecieverBox = (props) => {
  return (
		<Col className="reciever-spacing" xs="12">
			<Col className="recieverBox" sm="12" md={{ size: 12 }}>
				{props.children}
			</Col>
		</Col>
  );
};

export default RecieverBox;
