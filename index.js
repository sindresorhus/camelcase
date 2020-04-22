'use strict';

const preserveCamelCase = string => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for (let i = 0; i < string.length; i++) {
		const character = string[i];

		if (isLastCharLower && /[\p{Lu}]/u.test(character)) {
			string = string.slice(0, i) + '-' + string.slice(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && /[\p{Ll}]/u.test(character)) {
			string = string.slice(0, i - 1) + '-' + string.slice(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = character.toLocaleLowerCase() === character && character.toLocaleUpperCase() !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = character.toLocaleUpperCase() === character && character.toLocaleLowerCase() !== character;
		}
	}

	return string;
};

const handlePascalCase = input => (
	input.charAt(0).toLocaleUpperCase() + input.slice(1)
);

const handlePreserveConsecutiveUppercase = input => (
	input.replace(/^[\p{Lu}](?![\p{Lu}])/gu, m1 => m1.toLocaleLowerCase())
);

const camelCase = (input, options) => {
	if (!(typeof input === 'string' || Array.isArray(input))) {
		throw new TypeError('Expected the input to be `string | string[]`');
	}

	options = {
		...{
			pascalCase: false,
			preserveConsecutiveUppercase: false
		},
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
		return options.pascalCase ? input.toLocaleUpperCase() : input.toLocaleLowerCase();
	}

	const hasUpperCase = input !== input.toLocaleLowerCase();

	if (hasUpperCase) {
		input = preserveCamelCase(input);
	}

	input = input
		.replace(/^[_.\- ]+/, '');

	input = options.preserveConsecutiveUppercase ? handlePreserveConsecutiveUppercase(input) : input.toLocaleLowerCase();

	input = input
		.replace(/[_.\- ]+([\p{Alpha}\p{N}_]|$)/gu, (_, p1) => p1.toLocaleUpperCase())
		.replace(/\d+([\p{Alpha}\p{N}_]|$)/gu, m => m.toLocaleUpperCase());

	if (options.pascalCase) {
		input = handlePascalCase(input);
	}

	return input;
};

module.exports = camelCase;
// TODO: Remove this for the next major release
module.exports.default = camelCase;
