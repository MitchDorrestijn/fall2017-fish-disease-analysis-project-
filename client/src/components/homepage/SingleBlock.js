import React from 'react';
import ActionButton from '../base/ActionButton';
import { Col } from 'reactstrap';

const SingleBlock = (props) => {
	return (
		<Col sm="6" className="singleBlock" style={{backgroundImage: `url(${props.background})`}}>
			<Col sm="6" className="singleBlock-content">
				<h2>{props.title}</h2>
				<p>{props.text}</p>
				<ActionButton link={true} linkTo={props.link} color="primary btn-transparent" buttonText={props.btnText} />
			</Col>
		</Col>
	);
}

export default SingleBlock;
