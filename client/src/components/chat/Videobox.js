import React from 'react';
import { Row, Button } from 'reactstrap';

export default class Videobox extends React.Component {

	toggleAudio = () => {
		this.props.stream.getAudioTracks()[0].enabled = !(this.props.stream.getAudioTracks()[0].enabled);
		if(this.props.stream.getAudioTracks()[0].enabled){
			document.getElementById("toggleAudio").className = "btn-circle btn btn-primary";
		}else{
			document.getElementById("toggleAudio").className = "btn-circle btn btn-secondary";
		}
	}

	toggleVideo = () => {
		this.props.stream.getVideoTracks()[0].enabled = !(this.props.stream.getVideoTracks()[0].enabled);
		if(this.props.stream.getVideoTracks()[0].enabled){
			document.getElementById("toggleVideo").className = "btn-circle btn btn-primary";
		}else{
			document.getElementById("toggleVideo").className = "btn-circle btn btn-secondary";
		}
	}

	render(){
		return (
			<div className="fixed-wrapper">
				<div className="inner-video-wrapper">
					<div className="video-center">
						<Row className="no-gutter">
							<video className="otherCam" id="otherCam" autoPlay></video>
						</Row>
						<Row className="no-gutter videoContainer">
							<video className="myCam" id="myCam" autoPlay muted></video>
							<div className="videoOverlay">
								<div className="videoOverlayText">
									<Button id="toggleAudio" onClick={() => this.toggleAudio()} className="btn-circle" color="primary"><i className="fa fa-microphone-slash"/></Button>
									<Button id="toggleVideo" onClick={() => this.toggleVideo()} className="btn-circle" color="primary"><i className="fa fa-video-camera"/></Button>
								</div>
							</div>
						</Row>
					</div>
				</div>
			</div>
		);
	};
}
