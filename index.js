'use strict';
camelCase.constructor = constructor;
module.exports = camelCase;

function camelCase() {
	var str = [].map.call(arguments, function (str) {
		return str.trim();
	}).filter(function (str) {
		return str.length;
	}).join('-');

	if (!str.length) {
		return '';
	}

	if (str.length === 1 || !(/[_.\- ]+/).test(str)) {
		if (str[0] === str[0].toLowerCase() && str.slice(1) !== str.slice(1).toLowerCase()) {
			return str;
		}

		return str.toLowerCase();
	}

	return str
	.replace(/^[_.\- ]+/, '')
	.toLowerCase()
	.replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
		return p1.toUpperCase();
	});
}

function constructor() {
	var str = camelCase.apply(null, arguments);
	if (str.length) {
		str = str[0].toUpperCase() + str.substring(1);
	}
	return str;
}
