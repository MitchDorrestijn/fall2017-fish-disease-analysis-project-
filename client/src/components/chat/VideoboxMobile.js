import React from 'react';
import { Row, Button } from 'reactstrap';

export default class VideoboxMobile extends React.Component {

	toggleAudio = () => {
		this.props.stream.getAudioTracks()[0].enabled = !(this.props.stream.getAudioTracks()[0].enabled);
		if(this.props.stream.getAudioTracks()[0].enabled){
			document.getElementById("toggleAudioMobile").className = "btn-circle btn btn-primary";
		}else{
			document.getElementById("toggleAudioMobile").className = "btn-circle btn btn-secondary";
		}
	}

	toggleVideo = () => {
		this.props.stream.getVideoTracks()[0].enabled = !(this.props.stream.getVideoTracks()[0].enabled);
		if(this.props.stream.getVideoTracks()[0].enabled){
			document.getElementById("toggleVideoMobile").className = "btn-circle btn btn-primary";
		}else{
			document.getElementById("toggleVideoMobile").className = "btn-circle btn btn-secondary";
		}
	}

	render(){
		return (
			<div className="fixed-wrapper-mobile">
				<div className="inner-video-wrapper">
					<div className="video-center">
						<Row className="no-gutter">
							<video className="otherCam" id="otherCam" autoPlay></video>
							<video className="myCam" id="myCam" autoPlay muted></video>
						</Row>
						<Row className="no-gutter btns">
							<Button id="toggleAudioMobile" onClick={() => this.toggleAudio()} className="btn-circle" color="primary"><i className="fa fa-microphone-slash"/></Button>
							<Button id="toggleVideoMobile" onClick={() => this.toggleVideo()} className="btn-circle" color="primary"><i className="fa fa-video-camera"/></Button>
						</Row>
					</div>
				</div>
			</div>
		);
	};
}