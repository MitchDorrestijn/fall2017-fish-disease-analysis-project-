import React from 'react';
import { Col, Button } from 'reactstrap';

const Videobox = (props) => {
  return (
		<div className="fixed-wrapper">
			<div className="inner-video-wrapper">
				<div className="video-center">
					<Col md="12" className="no-gutter">
						<video id="otherCam" autoPlay muted></video>
					</Col>
					<Col md="12" className="no-gutter">
						<video id="myCam" autoPlay muted></video>
					</Col>
					<Col md="12" className="no-gutter">
						<Button color="primary" onClick={() => props.checkOnline()} block><i className="fa fa-video-camera"/> Call</Button>
					</Col>
				</div>
			</div>
		</div>
  );
};

export default Videobox;
