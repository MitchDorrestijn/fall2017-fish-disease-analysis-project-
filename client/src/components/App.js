import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import '../styles/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './navigation/NavigationBar';
import Homepage from './homepage/Homepage';
import MyAquarium from './myAquarium/MyAquarium';

export default class App extends React.Component {
	render() {
		return (
			<div className="App">
				<NavigationBar/>
				<div className="block-wrapper">
					<BrowserRouter>
						<Switch>
							<Route exact path="/" component={Homepage}/>
							<Route exact path="/myAquarium" component={MyAquarium}/>
						</Switch>
					</BrowserRouter>
				</div>
			</div>
		);
	}
}
