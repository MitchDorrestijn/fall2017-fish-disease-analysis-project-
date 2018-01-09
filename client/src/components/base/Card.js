import React from 'react';
import { Card, CardImg, CardBody } from 'reactstrap';

const FishCard = (props) => {
  return (
		<div className={'col-md-12 no-gutter '+ props.inAquarium}>
    <Card>
				<i onClick={props.onRemove} className='fa fa-close'></i>
      	{props.image && <CardImg top width="100%" src={process.env.PUBLIC_URL + props.image} alt="Card image cap" />}
      	<CardBody>
					{props.children}
      	</CardBody>
    </Card>
	</div>
  );
};

export default FishCard;
