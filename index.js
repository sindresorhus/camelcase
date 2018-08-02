'use strict';

const casex = require('casex');

module.exports = (input, options) => {
	input = Array.isArray(input) ? input.join('-') : input;

	const pattern = (options || {}).pascalCase ? 'CaSe' : 'caSe';
	const str = input
		.replace(/[A-Z][a-z]/g, value => `-${value}`)
		.replace(/[A-Z]+/g, value => `-${value}`);

	return casex(str, pattern, '\\s-_.,');
};
