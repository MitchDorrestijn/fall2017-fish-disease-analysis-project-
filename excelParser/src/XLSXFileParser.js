const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

module.exports = class XLSXFileParser {
	constructor(config, sheetNumber) {
		this.config = config;
		this.file = xlsx.read(fs.readFileSync(path.join(__dirname, '..', this.config.file)));
		this.sheetNumber = sheetNumber ? sheetNumber : 0;
	};

	_stripNewLines(value) {
		return typeof value === 'string'
			? value.replace(/(\r\n|\n|\r)/gm, ' ')
			: value;
	}

	_limitArray(array, start, end) {
		let startIndex = 0;
		let endIndex = 0;
		for (let i = 0; i < array.length; i++) {
			if (i === start || array[i] === start) {
				startIndex = i;
			}
			if (i === end || array[i] === end) {
				endIndex = i;
			}
		}
		return array.slice (startIndex, endIndex);
	}

	setSheetNumber(sheetNumber) {
		this.sheetNumber = sheetNumber;
	}

	getSheet() {
		return this.file [this.sheetNumber];
	}

	getColumn(rowNumber, start, end) {
		const result = this.file [this.sheetNumber].data.map((elem) => {
			return this._stripNewLines(elem [rowNumber]);
		});
		if (start !== undefined && end !== undefined) {
			return this._limitArray (result, start, end);
		} else {
			return result;
		}
	}

	getRow(columnNumber, start, end) {
		const result = this.file [this.sheetNumber].data [columnNumber].map((elem) => {
			return this._stripNewLines(elem);
		});
		if (start !== undefined && end !== undefined) {
			return this._limitArray (result, start, end);
		} else {
			return result;
		}
	}

	getField(x, y) {
		return this._stripNewLines(this.file [this.sheetNumber].data [y][x]);
	}
};