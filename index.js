'use strict';

function preserveCamelCase(str) {
	return str.replace(/([a-z][^A-Z]*)([A-Z])|([A-Z])([A-Z][a-z])/g, function () {
		const $1 = arguments[1];
		const $2 = arguments[2];
		const $3 = arguments[3];
		const $4 = arguments[4];
		return ($1 || $3) + '-' + ($2 || $4);
	});
}

module.exports = function (str) {
	if (arguments.length > 1) {
		str = Array.from(arguments)
			.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		str = str.trim();
	}

	if (str.length === 0) {
		return '';
	}

	if (str.length === 1) {
		return str.toLowerCase();
	}

	if (/^[a-z0-9]+$/.test(str)) {
		return str;
	}

	const hasUpperCase = str !== str.toLowerCase();

	if (hasUpperCase) {
		str = preserveCamelCase(str);
	}

	return str
		.replace(/^[_.\- ]+/, '')
		.toLowerCase()
		.replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());
};
