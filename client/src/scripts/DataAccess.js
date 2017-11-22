import 'whatwg-fetch';
export default class DataAccess {
	constructor (authString) {
		this.api = "http://localhost:5000/api";
	}

	_fetchApi (request, cb) {
		let status;
		fetch (request).then ((res) => {
			return res;
		}).then ((res) => {
			if (res.status >= 200 && res.status < 300) {
				status = res.status;
				return res.text ();
			} else {
				return Promise.reject (res);
			}
		}).then ((res) => {
			try {
				cb (null, {status: status, message: JSON.parse (res)});
			} catch (e) {
				cb (null, {status: status, message: res});
			}
		}).catch ((res) => {
			if (res.text) {
				return res.text ()
				.then ((res1) => {
					return res1;
				}).then ((res1) => {
					cb ({status: res.status, message: res1}, null);
				});
			} else {
				cb ({status: res.status, message: null}, null);
			}
		});
	}

	getData (url, cb) {
		// let headers = new Headers ();
		let requestParams = {
			method: 'GET',
			// headers: headers,
			cache: 'default'
		};
		let request = new Request (this.api + url, requestParams);
		this._fetchApi (request, cb);
	}

	postData (url, body, cb) {
		let headers = new Headers ();
		headers.append ("Content-Type", "application/json");
		let requestParams = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify (body)
		};
		let request = new Request (this.api + url, requestParams);
		this._fetchApi (request, cb);
	}

	putData (url, body, cb) {
		let headers = new Headers ();
		headers.append ("Content-Type", "application/json");
		let requestParams = {
			method: 'PUT',
			headers: headers,
			body: JSON.stringify (body)
		};
		let request = new Request (this.api + url, requestParams);
		this._fetchApi (request, cb);
	}

	deleteData (url, cb) {
		let headers = new Headers ();
		let requestParams = {
			method: 'DELETE',
			headers: headers,
		};
		let request = new Request (this.api + url, requestParams);
		this._fetchApi (request, cb);
	}
}