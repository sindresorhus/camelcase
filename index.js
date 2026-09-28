const UPPERCASE = /\p{Uppercase_Letter}/v;
const LOWERCASE = /\p{Lowercase_Letter}/v;
const ALPHABETIC = /\p{Alphabetic}/v;
// A decimal digit in any script, not only ASCII like `\d`. Other \p{Number} characters, such as superscripts and Roman numerals, are not digit runs.
const DIGIT = /\p{Decimal_Number}/v;
const LEADING_CAPITAL = /^\p{Uppercase_Letter}(?!\p{Uppercase_Letter})/v;
const SEPARATORS = /[ \-._]+/v;
const LEADING_PREFIX = /^[$_]*/v;

// The |$ alternative allows matching at end-of-string, capturing empty string
// This enables NUMBERS_AND_IDENTIFIER to match digits at string end (e.g., "test123")
//
// A combining mark with no base letter is not an identifier, so `a-́b` comes back unchanged. A mark after a base letter is fine, so decomposed `café-bar` still gives `caféBar`.
const IDENTIFIER = /(?<identifier>[\p{Alphabetic}\p{Number}_]|$)/v;

const LEADING_SEPARATORS = new RegExp('^' + SEPARATORS.source, 'v');
// A long separator run followed by a rejecting character backtracks quadratically (see the input length note in the readme). An atomic run would change the result for inputs like `a-_-!`, where the trailing `_` is the identifier.
// eslint-disable-next-line regexp/no-super-linear-move
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, 'gv');
// False positive: `\p{Decimal_Number}` is a subset of the identifier class, so a rejecting suffix costs one backtrack, not one per digit. A run of millions of non-ASCII digits can overflow V8's regex stack and throw a RangeError (see the input length note in the readme).
// eslint-disable-next-line regexp/no-super-linear-move
const NUMBERS_AND_IDENTIFIER = new RegExp(String.raw`\p{Decimal_Number}+` + IDENTIFIER.source, 'gv');

const preserveCamelCase = (string, toLowerCase, toUpperCase, preserveConsecutiveUppercase) => {
	// Iterate code points, not code units. Letters outside the basic multilingual plane need a surrogate pair, so indexing the string directly would see two meaningless halves per letter.
	const characters = [...string];
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;
	let isLastLastCharPreserved = false;

	for (let index = 0; index < characters.length; index++) {
		const character = characters[index];

		// Was the character 3 positions back inserted as a separator?
		// Prevents excessive separators by checking if we recently inserted one
		// index - 3 accounts for: current character, inserted separator, previous character
		// Default true for early positions activates the preserveConsecutiveUppercase guard
		isLastLastCharPreserved = index > 2 ? characters[index - 3] === '-' : true;

		if (isLastCharLower && UPPERCASE.test(character)) {
			// FooBar → Foo-Bar (insert separator before uppercase)
			characters.splice(index, 0, '-');
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
			characters.splice(index - 1, 0, '-');
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

	return characters.join('');
};

// Only a lone leading capital is lowercased. Cased characters that are not Uppercase_Letter (titlecase letters, Roman numerals) survive here, while the capitalizeAfterNumber: false path lowercases them.
const preserveConsecutiveUppercase = (input, toLowerCase) => input.replace(LEADING_CAPITAL, match => toLowerCase(match));

const processWithCasePreservation = (input, toLowerCase, shouldPreserveConsecutiveUppercase) => {
	let result = '';
	let wasNumberBefore = false;

	// Iterate code points, not code units (see preserveCamelCase)
	const characters = [...input];

	for (let index = 0; index < characters.length; index++) {
		const character = characters[index];
		const isUpperCase = UPPERCASE.test(character);

		// Mirrors LEADING_CAPITAL: a lone capital at the very start of the string is lowercased, even when preserveConsecutiveUppercase is on.
		const isLoneLeadingCapital = index === 0
			&& isUpperCase
			&& !(index + 1 < characters.length && UPPERCASE.test(characters[index + 1]));

		if (wasNumberBefore && ALPHABETIC.test(character)) {
			// Letter after number - preserve original case
			result += character;
			wasNumberBefore = false;
		} else if (shouldPreserveConsecutiveUppercase && isUpperCase && !isLoneLeadingCapital) {
			// Mirror the capitalizeAfterNumber: true path, which keeps every capital except a lone leading one.
			result += character;
		} else if (DIGIT.test(character)) {
			// Number - keep as-is and track it
			result += character;
			wasNumberBefore = true;
		} else if (SEPARATORS.test(character)) {
			// Separator - keep as-is, and end any digit run, so the next letter is lowercased like any other.
			result += character;
			wasNumberBefore = false;
		} else {
			// Regular character - lowercase it. This goes one character at a time, so U+03A3 never becomes the final sigma, which depends on the surrounding characters.
			result += toLowerCase(character);
			wasNumberBefore = false;
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
	const leadingPrefix = input.match(LEADING_PREFIX)[0];
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
		// Read the first code point, not the first code unit, so astral letters get uppercased.
		const firstCharacter = String.fromCodePoint(input.codePointAt(0));
		input = toUpperCase(firstCharacter) + input.slice(firstCharacter.length);
	}

	return leadingPrefix + postProcess(input, toUpperCase, options);
}
