const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx').default;

module.exports = class NodeXLSXFileParser {
	constructor(config) {
		this.config = config;
		this.file = xlsx.parse(fs.readFileSync(this.config.file));
	};

	static _stripNewLines(value) {
		return typeof value === 'string'
			? value.replace(/(\r\n|\n|\r)/gm, ' ')
			: value;
	}

	static _limitArray(array, start, end) {
		let startIndex = 0;
		let endIndex = 0;
		for (let i = 0; i < array.length; i++) {
			if (i === start || array[i] === start) startIndex = i;
			if (i === end || array[i] === end) endIndex = i;
		}
		return array.slice(startIndex, endIndex);
	}

	getColumn(rowNumber, start, end) {
		const result = this.file[this.config.sheetNumber].data.map((elem) => {
			return NodeXLSXFileParser._stripNewLines(elem[rowNumber]);
		});
		return (start !== undefined && end !== undefined) ? NodeXLSXFileParser._limitArray(result, start, end) : result;
	}

	getRow(columnNumber, start, end) {
		const result = this.file[this.config.sheetNumber].data[columnNumber].map((elem) => {
			return NodeXLSXFileParser._stripNewLines(elem);
		});
		return (start !== undefined && end !== undefined) ? NodeXLSXFileParser._limitArray(result, start, end) : result;
	}

	getField(x, y) {
		try {
			return NodeXLSXFileParser._stripNewLines(this.file[this.config.sheetNumber].data[y][x]);
		} catch (e) {
			return undefined;
		}
	}
};