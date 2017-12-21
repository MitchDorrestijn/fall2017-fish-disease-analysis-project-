import DataAccess from '../scripts/DataAccess';

export default class UserService{
	constructor(){
		this.da = new DataAccess ();
	}

	getUserData(user, cb) {
		this.da.getData(`/users/${user.uid}`, cb);
	}

	updateUserData(userId, body, cb) {
		const json = {
			user: {
				firstName: body.firstName, 
				lastName: body.lastName,
				country: body.country,
				birthDate: body.birthDate
			}
		}

		if(!body.password.length == 0){
			json.user.password = body.password;
		}

		this.da.putData(`/users/${userId}`, json, cb);
	}
}