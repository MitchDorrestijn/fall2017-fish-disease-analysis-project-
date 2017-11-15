import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import '../styles/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './navigation/NavigationBar';
import Homepage from './homepage/Homepage';

export default class App extends React.Component {
	render() {
		return (
			<div className="App">
				<NavigationBar/>
				<BrowserRouter>
					<Route exact path="/" component={Homepage}/>
				</BrowserRouter>
			</div>
		);
	}
}
