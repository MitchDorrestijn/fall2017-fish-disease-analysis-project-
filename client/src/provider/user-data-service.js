import DataAccess from '../scripts/DataAccess';

export default class UserService{
	constructor(){
		this.da = new DataAccess ();
	}

	getUserData(user,cb) {
		this.da.getData(`/users/${user.uid}` ,cb);
	}

	updateUserData(userId,body,cb) {
		this.da.postData(`/users/${userId}`,body,cb);
	}
}