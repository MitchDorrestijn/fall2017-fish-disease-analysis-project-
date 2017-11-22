import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Button,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	Input
} from 'reactstrap';
import Error from './Error';
import fuzzyFilterFactory from 'react-fuzzy-filter';



class AddFish extends React.Component {
	constructor(props){
		super(props);
		this.InputFilter = fuzzyFilterFactory().InputFilter;
		this.FilterResults = fuzzyFilterFactory().FilterResults;
	}
	render() {

		const items = [
      { name: 'first', meta: 'first|123', tag: 'a' },
      { name: 'second', meta: 'second|443', tag: 'b' },
      { name: 'third', meta: 'third|623', tag: 'a' },
    ];
    const fuseConfig = {
      keys: ['meta', 'tag']
    };

		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Add fish</ModalHeader>
				<ModalBody>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
					<FormGroup>
						<Label for="addfish">Name of fish:</Label>
						<InputGroup>


							<this.InputFilter debounceTime={200} />
			 				<div>Any amount of content between</div>
			 				<this.FilterResults items={items} fuseConfig={fuseConfig}>
								{filteredItems => {
					 				return(
						 				<div>
							 				{filteredItems.forEach(item => <div>{item.name}</div>)}
						 				</div>
					 				)
				 				}}
			 				</this.FilterResults>



						</InputGroup>
					</FormGroup>
					<hr/>
					<Button outline className="modalLink" color="secondary" block>Add fish</Button>
				</ModalBody>
			</div>
		);
	}
}

export default AddFish;
