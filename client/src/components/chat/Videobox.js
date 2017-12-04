import React from 'react';
import { Col, Button } from 'reactstrap';

export default class Videobox extends React.Component {
	
	toggleAudio = () => {
		this.props.stream.getAudioTracks()[0].enabled = !(this.props.stream.getAudioTracks()[0].enabled);
	}
	
	toggleVideo = () => {
		this.props.stream.getVideoTracks()[0].enabled = !(this.props.stream.getVideoTracks()[0].enabled);
	}
	
	render(){
		return (
			<div className="fixed-wrapper">
				<div className="inner-video-wrapper">
					<div className="video-center">
						<Col md="12" className="no-gutter">
							<video id="otherCam" autoPlay></video>
						</Col>
						<Col md="12" className="no-gutter">
							<video id="myCam" autoPlay muted></video>
						</Col>
						<Col md="12" className="no-gutter">
							<Button color="primary" onClick={() => this.toggleAudio()}><i className="fa fa-microphone-slash"/> Audio</Button>
							<Button color="primary" onClick={() => this.toggleVideo()}><i className="fa fa-video-camera"/> Video</Button>
						</Col>
						<Col md="12" className="no-gutter">
							<Button color="primary" onClick={() => this.props.checkOnline()}><i className="fa fa-phone"/> Call</Button>
							<Button color="primary" onClick={() => this.props.closeConnection()}><i className="fa fa-phone fa-rotate-90"/> Hangup</Button>
						</Col>
					</div>
				</div>
			</div>
		);
	};
}
