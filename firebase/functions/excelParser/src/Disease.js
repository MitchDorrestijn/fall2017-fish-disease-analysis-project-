module.exports = class Disease {
	constructor(name) {
		if (name.search(/\[[A-Za-z0-9]{1,}\] /g) !== -1) {
			this.code = name.split("[")[1].split("]")[0];
			console.log (this.code);
			let nameArray = name.split(" ");
			nameArray.shift();
			this.name = "";
			for (let i = 0; i < nameArray.length; i++) {
				this.name += nameArray[i];
				if (i < nameArray.length - 1) {
					this.name += " ";
				}
			}
			console.log (this.name);
		} else {
			this.name = name;
		}
	}

	getName() {
		return this.name;
	}

	getCode() {
		return this.code;
	}
};