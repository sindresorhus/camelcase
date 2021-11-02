'use strict';

const regexp1 = /[\p{Lu}]/u;
const regexp2 = /[\p{Ll}]/u;
const preserveCamelCase = (string, locale) => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for (let i = 0; i < string.length; i++) {
		const character = string[i];

		if (isLastCharLower && regexp1.test(character)) {
			string = string.slice(0, i) + '-' + string.slice(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && regexp2.test(character)) {
			string = string.slice(0, i - 1) + '-' + string.slice(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = character.toLocaleLowerCase(locale) === character && character.toLocaleUpperCase(locale) !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = character.toLocaleUpperCase(locale) === character && character.toLocaleLowerCase(locale) !== character;
		}
	}

	return string;
};

const regexp3 = /^[\p{Lu}](?![\p{Lu}])/gu;
const preserveConsecutiveUppercase = input => {
	regexp3.lastIndex = 0;
	return input.replace(regexp3, m1 => m1.toLowerCase());
};

const regexp4 = /[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu;
const regexp5 = /\d+([\p{Alpha}\p{N}_]|$)/gu;
const postProcess = (input, options) => {
	regexp4.lastIndex = 0;
	regexp5.lastIndex = 0;
	return input.replace(regexp4, (_, p1) => p1.toLocaleUpperCase(options.locale))
		.replace(regexp5, m => m.toLocaleUpperCase(options.locale));
};

const regexp6 = /^[_.\- ]+/;
const camelCase = (input, options) => {
	if (!(typeof input === 'string' || Array.isArray(input))) {
		throw new TypeError('Expected the input to be `string | string[]`');
	}

	options = {
		pascalCase: false,
		preserveConsecutiveUppercase: false,
		...options
	};

	if (Array.isArray(input)) {
		input = input.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		input = input.trim();
	}

	if (input.length === 0) {
		return '';
	}

	if (input.length === 1) {
		return options.pascalCase ? input.toLocaleUpperCase(options.locale) : input.toLocaleLowerCase(options.locale);
	}

	const hasUpperCase = input !== input.toLocaleLowerCase(options.locale);

	if (hasUpperCase) {
		input = preserveCamelCase(input, options.locale);
	}

	input = input.replace(regexp6, '');

	if (options.preserveConsecutiveUppercase) {
		input = preserveConsecutiveUppercase(input);
	} else {
		input = input.toLocaleLowerCase();
	}

	if (options.pascalCase) {
		input = input.charAt(0).toLocaleUpperCase(options.locale) + input.slice(1);
	}

	return postProcess(input, options);
};

module.exports = camelCase;
// TODO: Remove this for the next major release
module.exports.default = camelCase;
