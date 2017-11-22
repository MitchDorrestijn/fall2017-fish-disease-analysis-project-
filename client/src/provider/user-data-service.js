import DataAccess from '../scripts/DataAccess';

export default class UserService{
	constructor(){
		this.da = new DataAccess ();
	}

	getUserData(user,cb) {
		this.da.getData(`/user/${user.id}` ,cb);
	}

	updateUserData(userId,body,cb) {
		this.da.postData(`/user/${userId}`,body,cb);
	}
}