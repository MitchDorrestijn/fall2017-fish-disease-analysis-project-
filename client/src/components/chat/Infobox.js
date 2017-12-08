import React from 'react';
import { Col } from 'reactstrap';

const InfoBox = (props) => {
  return (
		<Col className="info-spacing" xs="12">
			<Col className="infoBox text-center" sm="12" md={{ size: 12 }}>
				<strong><i>{props.children}</i></strong>
			</Col>
		</Col>
  );
};

export default InfoBox;