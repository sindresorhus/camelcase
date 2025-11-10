const UPPERCASE = /[\p{Lu}]/u;
const LOWERCASE = /[\p{Ll}]/u;
const LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/u;
const SEPARATORS = /[_.\- ]+/;

// The |$ alternative allows matching at end-of-string, capturing empty string
// This enables NUMBERS_AND_IDENTIFIER to match digits at string end (e.g., "test123")
const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;

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

		// Was the character 3 positions back inserted as a separator?
		// Prevents excessive separators by checking if we recently inserted one
		// index - 3 accounts for: current character, inserted separator, previous character
		// Default true for early positions activates the preserveConsecutiveUppercase guard
		isLastLastCharPreserved = index > 2 ? string[index - 3] === '-' : true;

		if (isLastCharLower && UPPERCASE.test(character)) {
			// FooBar → Foo-Bar (insert separator before uppercase)
			string = string.slice(0, index) + '-' + string.slice(index);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			index++;
		} else if (
			isLastCharUpper
			&& isLastLastCharUpper
			&& LOWERCASE.test(character)
			&& (!isLastLastCharPreserved || preserveConsecutiveUppercase)
		) {
			// FOOBar → FOO-Bar
			string = string.slice(0, index - 1) + '-' + string.slice(index - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower
				= toLowerCase(character) === character
					&& toUpperCase(character) !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper
				= toUpperCase(character) === character
					&& toLowerCase(character) !== character;
		}
	}

	return string;
};

const preserveConsecutiveUppercase = (input, toLowerCase) => input.replace(LEADING_CAPITAL, match => toLowerCase(match));

const processWithCasePreservation = (input, toLowerCase, preserveConsecutiveUppercase) => {
	let result = '';
	let previousWasNumber = false;
	let previousWasUppercase = false;

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
		} else if (SEPARATORS.test(character)) {
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

/**
Core post-processing:
- Collapses separators and uppercases the following identifier character.
- Optionally uppercases the identifier following a numeric sequence.

Two-pass strategy prevents conflicts:
1. NUMBERS_AND_IDENTIFIER: handles digit-to-letter transitions
2. SEPARATORS_AND_IDENTIFIER: handles separator-to-identifier transitions

Example: "b2b_registration" with capitalizeAfterNumber: true
- Pass 1: "2b" matches, next char is "_" (separator), so don't capitalize → "b2b_registration"
- Pass 2: "_r" matches, replace with "R" → "b2bRegistration"
*/
const postProcess = (input, toUpperCase, {capitalizeAfterNumber}) => {
	const transformNumericIdentifier = capitalizeAfterNumber
		? (match, identifier, offset, string) => {
			const nextCharacter = string.charAt(offset + match.length);

			// If the numeric+identifier run is immediately followed by a separator,
			// treat it as a continued token and do not force a new word.
			if (SEPARATORS.test(nextCharacter)) {
				return match;
			}

			// Only uppercase the identifier part (not the digits) for efficiency
			return identifier ? match.slice(0, -identifier.length) + toUpperCase(identifier) : match;
		}
		// When false: numbers do not create a word boundary.
		: match => match;

	return input
		.replaceAll(NUMBERS_AND_IDENTIFIER, transformNumericIdentifier)
		.replaceAll(
			SEPARATORS_AND_IDENTIFIER,
			(_, identifier) => toUpperCase(identifier),
		);
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
		input = input
			.map(element => element.trim())
			.filter(element => element.length > 0)
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

		return leadingPrefix + (options.pascalCase
			? toUpperCase(input)
			: toLowerCase(input));
	}

	const hasUpperCase = input !== toLowerCase(input);

	if (hasUpperCase) {
		input = preserveCamelCase(
			input,
			toLowerCase,
			toUpperCase,
			options.preserveConsecutiveUppercase,
		);
	}

	// Strip leading separators eagerly so they do not affect word detection
	input = input.replace(LEADING_SEPARATORS, '');

	// Normalize base casing while preserving intended consecutive uppers
	if (options.capitalizeAfterNumber) {
		// Standard behavior - lowercase everything (or preserve consecutive uppercase)
		input = options.preserveConsecutiveUppercase
			? preserveConsecutiveUppercase(input, toLowerCase)
			: toLowerCase(input);
	} else {
		// Preserve case after numbers (processWithCasePreservation handles preserveConsecutiveUppercase internally)
		input = processWithCasePreservation(input, toLowerCase, options.preserveConsecutiveUppercase);
	}

	if (options.pascalCase && input.length > 0) {
		input = toUpperCase(input[0]) + input.slice(1);
	}

	return leadingPrefix + postProcess(input, toUpperCase, options);
}
