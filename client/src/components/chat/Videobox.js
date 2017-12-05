import React from 'react';
import { Col } from 'reactstrap';

const Videobox = () => {
  return (
		<div className="fixed-wrapper">
			<div className="inner-video-wrapper">
				<div className="video-center">
					<Col md="12" className="no-gutter">
						<video src="http://www.onirikal.com/videos/mp4/assembly_line.mp4" controls></video>
					</Col>
					<Col md="12" className="no-gutter">
						<video src="http://www.onirikal.com/videos/mp4/assembly_line.mp4" controls></video>
					</Col>
				</div>
			</div>
		</div>
  );
};

export default Videobox;
