import DataAccess from '../scripts/DataAccess';

export default class UserService{
	constructor(token){
		this.da = new DataAccess (token);
	}

	getUserData(user,cb) {
		this.da.getData(`/user/${user.uid}` ,cb);
	}

	updateUserData(userId,body,cb) {
		this.da.postData(`/user/${userId}`,body,cb);
	}
}