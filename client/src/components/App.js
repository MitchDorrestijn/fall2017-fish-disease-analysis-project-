import React from 'react';
import '../styles/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './navigation/NavigationBar';

export default class App extends React.Component {
	render() {
		return (
			<div className="App">
				<NavigationBar/>
			</div>
		);
	}
}

