import React from 'react';
import '../styles/styles.css';

class Header extends React.Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to
					reload.
				</p>
			</div>
		);
	}
}

export default Header;
