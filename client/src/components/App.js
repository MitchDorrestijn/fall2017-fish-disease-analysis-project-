import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import '../styles/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './navigation/NavigationBar';
import Homepage from './homepage/Homepage';
import MyAquarium from './myAquarium/MyAquarium';
import ModalBase from './modal/ModalBase';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			modalContent: null
		}
	}

	openModal = (content) => {
		this.setState ({
			showModal: true,
			modalContent: content
		});
	};

	closeModal = () => {
		this.setState ({
			showModal: false
		});
	};

	render() {
		return (
			<div className="App">
				<NavigationBar openModal={this.openModal}/>
				<div className="block-wrapper">
					<BrowserRouter>
						<Switch>
							<Route exact path="/" render={(props) => {
								return <Homepage {...props} openModal={this.openModal}/>
							}}/>
							<Route path="/myAquarium" component={MyAquarium}/>
						</Switch>
					</BrowserRouter>
				</div>
				<ModalBase isVisible={this.state.showModal} closeModal={this.closeModal}>
					{this.state.modalContent}
				</ModalBase>
			</div>
		);
	}
}
