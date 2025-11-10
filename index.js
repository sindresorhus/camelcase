const UPPERCASE = /[\p{Lu}]/u;
const LOWERCASE = /[\p{Ll}]/u;
const LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/gu;
const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;
const SEPARATOR = /[_.\- ]/;
const SEPARATORS = new RegExp(SEPARATOR.source + '+');

const LEADING_SEPARATORS = new RegExp('^' + SEPARATORS.source);
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, 'gu');
const NUMBERS_AND_IDENTIFIER = new RegExp(String.raw`\d+` + IDENTIFIER.source, 'gu');

const preserveCamelCase = (string, toLowerCase, toUpperCase, preserveConsecutiveUppercase) => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;
	let isLastLastCharPreserved = false;

	for (let index = 0; index < string.length; index++) {
		const character = string[index];
		isLastLastCharPreserved = index > 2 ? string[index - 3] === '-' : true;

		if (isLastCharLower && UPPERCASE.test(character)) {
			string = string.slice(0, index) + '-' + string.slice(index);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			index++;
		} else if (isLastCharUpper && isLastLastCharUpper && LOWERCASE.test(character) && (!isLastLastCharPreserved || preserveConsecutiveUppercase)) {
			string = string.slice(0, index - 1) + '-' + string.slice(index - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = toLowerCase(character) === character && toUpperCase(character) !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = toUpperCase(character) === character && toLowerCase(character) !== character;
		}
	}

	return string;
};

const preserveConsecutiveUppercase = (input, toLowerCase) => {
	LEADING_CAPITAL.lastIndex = 0;

	return input.replaceAll(LEADING_CAPITAL, match => toLowerCase(match));
};

const processWithCasePreservation = (input, toLowerCase, preserveConsecutiveUppercase) => {
	let result = '';
	let previousWasNumber = false;
	let previousWasUppercase = false;

	// When preserving consecutive uppercase, we need to identify uppercase sequences
	// Convert input to array for lookahead capability
	const characters = [...input];

	for (let index = 0; index < characters.length; index++) {
		const character = characters[index];
		const isUpperCase = UPPERCASE.test(character);
		const nextCharIsUpperCase = index + 1 < characters.length && UPPERCASE.test(characters[index + 1]);

		if (previousWasNumber && /[\p{Alpha}]/u.test(character)) {
			// Letter after number - preserve original case
			result += character;
			previousWasNumber = false;
			previousWasUppercase = isUpperCase;
		} else if (preserveConsecutiveUppercase && isUpperCase && (previousWasUppercase || nextCharIsUpperCase)) {
			// Part of consecutive uppercase sequence when preserveConsecutiveUppercase is true - keep it
			result += character;
			previousWasUppercase = true;
		} else if (/\d/.test(character)) {
			// Number - keep as-is and track it
			result += character;
			previousWasNumber = true;
			previousWasUppercase = false;
		} else if (SEPARATOR.test(character)) {
			// Separator - keep as-is and maintain previousWasNumber state
			result += character;
			previousWasUppercase = false;
		} else {
			// Regular character - lowercase it
			result += toLowerCase(character);
			previousWasNumber = false;
			previousWasUppercase = false;
		}
	}

	return result;
};

const postProcess = (input, toUpperCase, capitalizeAfterNumber) => {
	SEPARATORS_AND_IDENTIFIER.lastIndex = 0;
	NUMBERS_AND_IDENTIFIER.lastIndex = 0;

	const transformNumericIdentifier = capitalizeAfterNumber
		? (match, identifier, offset, string) => SEPARATOR.test(string.charAt(offset + match.length)) ? match : toUpperCase(match)
		// Don't capitalize after numbers as numbers can't show word boundaries (Google Style Guide)
		: match => match;

	return input
		.replaceAll(NUMBERS_AND_IDENTIFIER, transformNumericIdentifier)
		.replaceAll(SEPARATORS_AND_IDENTIFIER, (_, identifier) => toUpperCase(identifier));
};

export default function camelCase(input, options) {
	if (!(typeof input === 'string' || Array.isArray(input))) {
		throw new TypeError('Expected the input to be `string | string[]`');
	}

	options = {
		pascalCase: false,
		preserveConsecutiveUppercase: false,
		capitalizeAfterNumber: true,
		...options,
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

	// Preserve leading _ and $ as they have semantic meaning
	const leadingPrefix = input.match(/^[_$]*/)[0];
	input = input.slice(leadingPrefix.length);

	if (input.length === 0) {
		return leadingPrefix;
	}

	const toLowerCase = options.locale === false
		? string => string.toLowerCase()
		: string => string.toLocaleLowerCase(options.locale);

	const toUpperCase = options.locale === false
		? string => string.toUpperCase()
		: string => string.toLocaleUpperCase(options.locale);

	if (input.length === 1) {
		if (SEPARATORS.test(input)) {
			return leadingPrefix;
		}

		return leadingPrefix + (options.pascalCase ? toUpperCase(input) : toLowerCase(input));
	}

	const hasUpperCase = input !== toLowerCase(input);

	if (hasUpperCase) {
		input = preserveCamelCase(input, toLowerCase, toUpperCase, options.preserveConsecutiveUppercase);
	}

	input = input.replace(LEADING_SEPARATORS, '');

	if (options.capitalizeAfterNumber) {
		// Standard behavior - lowercase everything (or preserve consecutive uppercase)
		input = options.preserveConsecutiveUppercase ? preserveConsecutiveUppercase(input, toLowerCase) : toLowerCase(input);
	} else {
		// Preserve case after numbers
		input = processWithCasePreservation(input, toLowerCase, options.preserveConsecutiveUppercase);

		// Apply consecutive uppercase preservation if needed (for leading capitals)
		if (options.preserveConsecutiveUppercase) {
			input = preserveConsecutiveUppercase(input, toLowerCase);
		}
	}

	if (options.pascalCase) {
		input = toUpperCase(input.charAt(0)) + input.slice(1);
	}

	return leadingPrefix + postProcess(input, toUpperCase, options.capitalizeAfterNumber);
}
