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
		let buttonsMobile = [];
		if(this.props.stream !== null){
			buttonsMobile = [
				<Button key={5} id="toggleAudioMobile" onClick={() => this.toggleAudio()} className="btn-circle" color="primary"><i className="fa fa-microphone-slash"/></Button>,
				<Button key={6} id="toggleVideoMobile" onClick={() => this.toggleVideo()} className="btn-circle" color="primary"><i className="fa fa-video-camera"/></Button>,
				<Button key={7} id="stopWebcam" onClick={() => this.props.stopWebcam()} className="btn-circle" color="danger"><i className="fa fa-phone fa-rotate-90"/></Button>
			]
		}else{
			buttonsMobile.push(<Button key={8} id="startWebcam" onClick={() => this.props.startWebcam()} title="Start video call" className="btn-circle" color="success" disabled={!this.props.chatStatus}><i className="fa fa-phone"/></Button>);
		}
		if(this.props.adminPage){
			buttonsMobile.push(<Button key={9} id="closeChat" onClick={() => this.props.closeChat()} title="Close chat" className="btn-circle" color="danger" disabled={!this.props.appointmentStatus}><i className="fa fa-commenting-o"/></Button>);
		}
		
		return (
			<div className="fixed-wrapper-mobile">
				<div className="inner-video-wrapper">
					<div className="video-center">
						<Row className="no-gutter">
							<video className="otherCam" id="otherCam" autoPlay></video>
							<video className="myCam" id="myCam" autoPlay muted></video>
						</Row>
						<Row className="no-gutter btns">
							{
								buttonsMobile
							}
						</Row>
					</div>
				</div>
			</div>
		);
	};
}
