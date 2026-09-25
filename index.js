const UPPERCASE = /\p{Uppercase_Letter}/v;
const LOWERCASE = /\p{Lowercase_Letter}/v;
const LEADING_CAPITAL = /^\p{Uppercase_Letter}(?!\p{Uppercase_Letter})/v;
const SEPARATORS = /[ \-._]+/v;

// The |$ alternative allows matching at end-of-string, capturing empty string
// This enables NUMBERS_AND_IDENTIFIER to match digits at string end (e.g., "test123")
const IDENTIFIER = /(?<identifier>[\p{Alphabetic}\p{Number}_]|$)/v;

const LEADING_SEPARATORS = new RegExp('^' + SEPARATORS.source, 'v');
// A long run of separators followed by a rejecting character backtracks quadratically.
// This is the documented "limit the input length" limitation in the readme. Making the run
// atomic would change results for inputs like `a-_-!`, where the trailing `_` is the identifier.
// eslint-disable-next-line regexp/no-super-linear-move
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, 'gv');
// False positive: `\d` is a subset of the identifier class, so a rejecting suffix costs one
// backtrack, not one per digit. Measured linear up to 160k digits.
// eslint-disable-next-line regexp/no-super-linear-move
const NUMBERS_AND_IDENTIFIER = new RegExp(String.raw`\d+` + IDENTIFIER.source, 'gv');

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

const processWithCasePreservation = (input, toLowerCase, shouldPreserveConsecutiveUppercase) => {
	let result = '';
	let wasNumberBefore = false;
	let wasUpperCaseBefore = false;

	// Convert input to array for lookahead capability
	const characters = [...input];

	for (let index = 0; index < characters.length; index++) {
		const character = characters[index];
		const isUpperCase = UPPERCASE.test(character);
		const isNextCharUpperCase = index + 1 < characters.length && UPPERCASE.test(characters[index + 1]);

		if (wasNumberBefore && /\p{Alphabetic}/v.test(character)) {
			// Letter after number - preserve original case
			result += character;
			wasNumberBefore = false;
			wasUpperCaseBefore = isUpperCase;
		} else if (shouldPreserveConsecutiveUppercase && isUpperCase && (wasUpperCaseBefore || isNextCharUpperCase)) {
			// Part of consecutive uppercase sequence when preserveConsecutiveUppercase is true - keep it
			result += character;
			wasUpperCaseBefore = true;
		} else if (/\d/v.test(character)) {
			// Number - keep as-is and track it
			result += character;
			wasNumberBefore = true;
			wasUpperCaseBefore = false;
		} else if (SEPARATORS.test(character)) {
			// Separator - keep as-is and maintain wasNumberBefore state
			result += character;
			wasUpperCaseBefore = false;
		} else {
			// Regular character - lowercase it
			result += toLowerCase(character);
			wasNumberBefore = false;
			wasUpperCaseBefore = false;
		}
	}

	return result;
};

/*
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
	// When `capitalizeAfterNumber` is false, numbers do not create a word boundary, so pass 1 is skipped entirely.
	const withNumbers = capitalizeAfterNumber
		? input.replaceAll(NUMBERS_AND_IDENTIFIER, (match, identifier, offset, string) => {
			const nextCharacter = string.charAt(offset + match.length);

			// If the numeric+identifier run is immediately followed by a separator,
			// treat it as a continued token and do not force a new word.
			if (SEPARATORS.test(nextCharacter)) {
				return match;
			}

			// Only uppercase the identifier part (not the digits) for efficiency
			return identifier ? match.slice(0, -identifier.length) + toUpperCase(identifier) : match;
		})
		: input;

	return withNumbers.replaceAll(
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
	const leadingPrefix = input.match(/^[$_]*/v)[0];
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
