import DataAccess from '../scripts/DataAccess';

export default class UserService{
	constructor(){
		this.da = new DataAccess ();
	}

	getUserData(user,cb) {
		this.da.getData(`/user/${user.id}` ,cb);
	}

	setUserData(user,cb) {
		this.da.postData(`/user/${user.id}` ,cb);
	}
}