module.exports = class Disease {
	constructor(name) {
		if (name.search(/\[[A-Za-z0-9]{1,}\] /g) !== -1) {
			// Als er een koppelcode in de naam zit, strip deze van de naam en zet deze in een apart attribuut
			this.code = name.split("[")[1].split("]")[0];
			let nameArray = name.split(" ");
			nameArray.shift();
			this.name = "";
			for (let i = 0; i < nameArray.length; i++) {
				this.name += nameArray[i];
				if (i < nameArray.length - 1) {
					this.name += " ";
				}
			}
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