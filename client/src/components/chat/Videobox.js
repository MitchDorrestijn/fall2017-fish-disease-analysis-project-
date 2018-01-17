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
		let buttons = [];
		if(this.props.stream !== null){
			buttons = [
				<Button key={0} id="toggleAudio" onClick={() => this.toggleAudio()} title="Mute/unmute audio" className="btn-circle" color="primary"><i className="fa fa-microphone-slash"/></Button>,
				<Button key={1} id="toggleVideo" onClick={() => this.toggleVideo()} title="Turn video on/off"className="btn-circle" color="primary"><i className="fa fa-video-camera"/></Button>,
				<Button key={2} id="stopWebcam" onClick={() => this.props.stopWebcam()} title="Stop video call" className="btn-circle" color="danger"><i className="fa fa-phone fa-rotate-90"/></Button>
			]
		}else{
			buttons.push(<Button key={3} id="startWebcam" onClick={() => this.props.startWebcam()} title="Start video call" className="btn-circle" color="success" disabled={!this.props.chatStatus}><i className="fa fa-phone"/></Button>);
		}
		if(this.props.adminPage){
			buttons.push(<Button key={4} id="closeChat" onClick={() => this.props.closeChat()} title="Close chat" className="btn-circle" color="danger" disabled={!this.props.appointmentStatus}><i className="fa fa-commenting-o"/></Button>);
		}

		if(this.props.type === 'other'){
			return (
				<div className="fixed-wrapper">
					<div className="inner-video-wrapper">
						<div className="video-center">
							<Row className="no-gutter">
								<video className="otherCam" id="otherCam" autoPlay></video>
							</Row>
						</div>
					</div>
				</div>
			);
		} else if(this.props.type === 'you') {
			return (
				<div className="fixed-wrapper">
					<div className="inner-video-wrapper">
						<div className="video-center">
							<Row className="no-gutter videoContainer">
								<video className="myCam" id="myCam" autoPlay muted></video>
								<div className="videoOverlay">
									<div className="videoOverlayText">
										{
											buttons
										}
									</div>
								</div>
							</Row>
						</div>
					</div>
				</div>
			)
		}

	};
}