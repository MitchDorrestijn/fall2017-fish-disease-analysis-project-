import React from 'react';
import ActionButton from '../base/ActionButton';

const SingleBlock = (props) => {
	return (
		<div className="col-sm-6 singleBlock" style={{backgroundImage: `url(${props.background})`}}>
			<h2>{props.title}</h2>
			<p>{props.text}</p>
			<ActionButton link={true} linkTo={props.link} color="primary btn-transparent" buttonText={props.btnText} />
		</div>
	);
}

export default SingleBlock;
