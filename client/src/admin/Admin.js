import React from 'react';
import SideNav from './components/SideNav';
import '../styles/admin/admin.css';

const Admin = (props) => {
	return (
		<div className='adminWrapper'>
			<SideNav openModal={props.openModal}/>
		</div>
	);
};

export default Admin;
