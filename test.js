import {test} from 'node:test';
import assert from 'node:assert/strict';
import camelCase from './index.js';

const SEPARATORS = /[ \-._]+/v;
const DIGIT = /\p{Decimal_Number}/v;
const ALPHABETIC = /\p{Alphabetic}/v;

// Gathers failures of a property over a large cross product. Recording instead of asserting keeps the loop cheap, and the report shows the count plus a few examples so the output stays readable even when a whole family of inputs regresses at once.
const collectMismatches = sampleLimit => {
	const samples = [];
	const result = {
		total: 0,
		record(isMatch, describeFailure) {
			if (isMatch) {
				return;
			}

			result.total++;
			if (samples.length < sampleLimit) {
				samples.push(describeFailure());
			}
		},
		report() {
			const overflow = result.total > samples.length ? `\n\u{2026}and ${result.total - samples.length} more` : '';
			return samples.join('\n') + overflow;
		},
	};

	return result;
};

// Every combination of the three boolean options, written out once so the tests that want them all cannot drift apart. Tests that need a cross product pick a narrower subset, for speed.
const booleanOptionSets = [
	{},
	{pascalCase: true},
	{preserveConsecutiveUppercase: true},
	{capitalizeAfterNumber: false},
	{pascalCase: true, preserveConsecutiveUppercase: true},
	{pascalCase: true, capitalizeAfterNumber: false},
	{preserveConsecutiveUppercase: true, capitalizeAfterNumber: false},
	{pascalCase: true, preserveConsecutiveUppercase: true, capitalizeAfterNumber: false},
];

// The four that leave pascalCase off, for a test that turns pascalCase on separately.
const camelCaseOptionSets = booleanOptionSets.filter(options => !options.pascalCase);

// The first three of the list above, which are the ones with at most one option on. A test that is varying something else, such as the locale, wants these and nothing more.
const singleOptionSets = booleanOptionSets.slice(0, 3);

test('camelCase', () => {
	assert.equal(camelCase('b2b_registration_request'), 'b2bRegistrationRequest');
	assert.equal(camelCase('b2b-registration-request'), 'b2bRegistrationRequest');
	assert.equal(camelCase('b2b_registration_b2b_request'), 'b2bRegistrationB2bRequest');
	assert.equal(camelCase('foo'), 'foo');
	assert.equal(camelCase('IDs'), 'ids');
	assert.equal(camelCase('FooIDs'), 'fooIds');
	assert.equal(camelCase('foo-bar'), 'fooBar');
	assert.equal(camelCase('foo-bar-baz'), 'fooBarBaz');
	assert.equal(camelCase('foo--bar'), 'fooBar');
	assert.equal(camelCase('--foo-bar'), 'fooBar');
	assert.equal(camelCase('--foo--bar'), 'fooBar');
	assert.equal(camelCase('FOO-BAR'), 'fooBar');
	assert.equal(camelCase('FOÈ-BAR'), 'foèBar');
	assert.equal(camelCase('-foo-bar-'), 'fooBar');
	assert.equal(camelCase('--foo--bar--'), 'fooBar');
	assert.equal(camelCase('foo-1'), 'foo1');
	assert.equal(camelCase('foo.bar'), 'fooBar');
	assert.equal(camelCase('foo..bar'), 'fooBar');
	assert.equal(camelCase('..foo..bar..'), 'fooBar');
	assert.equal(camelCase('foo_bar'), 'fooBar');
	assert.equal(camelCase('__foo__bar__'), '__fooBar');
	assert.equal(camelCase('foo bar'), 'fooBar');
	assert.equal(camelCase('  foo  bar  '), 'fooBar');
	assert.equal(camelCase('-'), '');
	assert.equal(camelCase(' - '), '');
	assert.equal(camelCase('fooBar'), 'fooBar');
	assert.equal(camelCase('fooBar-baz'), 'fooBarBaz');
	assert.equal(camelCase('foìBar-baz'), 'foìBarBaz');
	assert.equal(camelCase('fooBarBaz-bazzy'), 'fooBarBazBazzy');
	assert.equal(camelCase('FBBazzy'), 'fbBazzy');
	assert.equal(camelCase('F'), 'f');
	assert.equal(camelCase('FooBar'), 'fooBar');
	assert.equal(camelCase('Foo'), 'foo');
	assert.equal(camelCase('FOO'), 'foo');
	assert.equal(camelCase(['foo', 'bar']), 'fooBar');
	assert.equal(camelCase(['foo', '-bar']), 'fooBar');
	assert.equal(camelCase(['foo', '-bar', 'baz']), 'fooBarBaz');
	assert.equal(camelCase(['', '']), '');
	assert.equal(camelCase('--'), '');
	assert.equal(camelCase(''), '');
	assert.equal(camelCase('_'), '_');
	assert.equal(camelCase(' '), '');
	assert.equal(camelCase('.'), '');
	assert.equal(camelCase('..'), '');
	assert.equal(camelCase('  '), '');
	assert.equal(camelCase('__'), '__');
	assert.equal(camelCase('--__--_--_'), '');
	assert.equal(camelCase(['---_', '--', '', '-_- ']), '');
	assert.equal(camelCase('foo bar?'), 'fooBar?');
	assert.equal(camelCase('foo bar!'), 'fooBar!');
	assert.equal(camelCase('foo bar$'), 'fooBar$');
	assert.equal(camelCase('foo-bar#'), 'fooBar#');
	assert.equal(camelCase('XMLHttpRequest'), 'xmlHttpRequest');
	assert.equal(camelCase('AjaxXMLHttpRequest'), 'ajaxXmlHttpRequest');
	assert.equal(camelCase('Ajax-XMLHttpRequest'), 'ajaxXmlHttpRequest');
	assert.equal(camelCase([]), '');
	assert.equal(camelCase('mGridCol6@md'), 'mGridCol6@md');
	assert.equal(camelCase('A::a'), 'a::a');
	assert.equal(camelCase('Hello1World'), 'hello1World');
	assert.equal(camelCase('Hello11World'), 'hello11World');
	assert.equal(camelCase('hello1world'), 'hello1World');
	assert.equal(camelCase('Hello1World11foo'), 'hello1World11Foo');
	assert.equal(camelCase('Hello1'), 'hello1');
	assert.equal(camelCase('hello1'), 'hello1');
	assert.equal(camelCase('1Hello'), '1Hello');
	assert.equal(camelCase('1hello'), '1Hello');
	assert.equal(camelCase('h2w'), 'h2W');
	assert.equal(camelCase('розовый_пушистый-единороги'), 'розовыйПушистыйЕдинороги');
	assert.equal(camelCase('РОЗОВЫЙ_ПУШИСТЫЙ-ЕДИНОРОГИ'), 'розовыйПушистыйЕдинороги');
	assert.equal(camelCase('桑德在这里。'), '桑德在这里。');
	assert.equal(camelCase('桑德_在这里。'), '桑德在这里。');
});

test('camelCase with pascalCase option', () => {
	assert.equal(camelCase('b2b_registration_request', {pascalCase: true}), 'B2bRegistrationRequest');
	assert.equal(camelCase('foo', {pascalCase: true}), 'Foo');
	assert.equal(camelCase('foo-bar', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('foo-bar-baz', {pascalCase: true}), 'FooBarBaz');
	assert.equal(camelCase('foo--bar', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('--foo-bar', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('--foo--bar', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('FOO-BAR', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('FOÈ-BAR', {pascalCase: true}), 'FoèBar');
	assert.equal(camelCase('-foo-bar-', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('--foo--bar--', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('foo-1', {pascalCase: true}), 'Foo1');
	assert.equal(camelCase('foo.bar', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('foo..bar', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('..foo..bar..', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('foo_bar', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('__foo__bar__', {pascalCase: true}), '__FooBar');
	assert.equal(camelCase('foo bar', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('  foo  bar  ', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('-', {pascalCase: true}), '');
	assert.equal(camelCase(' - ', {pascalCase: true}), '');
	assert.equal(camelCase('fooBar', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('fooBar-baz', {pascalCase: true}), 'FooBarBaz');
	assert.equal(camelCase('foìBar-baz', {pascalCase: true}), 'FoìBarBaz');
	assert.equal(camelCase('fooBarBaz-bazzy', {pascalCase: true}), 'FooBarBazBazzy');
	assert.equal(camelCase('FBBazzy', {pascalCase: true}), 'FbBazzy');
	assert.equal(camelCase('F', {pascalCase: true}), 'F');
	assert.equal(camelCase('FooBar', {pascalCase: true}), 'FooBar');
	assert.equal(camelCase('Foo', {pascalCase: true}), 'Foo');
	assert.equal(camelCase('FOO', {pascalCase: true}), 'Foo');
	assert.equal(camelCase(['foo', 'bar'], {pascalCase: true}), 'FooBar');
	assert.equal(camelCase(['foo', '-bar'], {pascalCase: true}), 'FooBar');
	assert.equal(camelCase(['foo', '-bar', 'baz'], {pascalCase: true}), 'FooBarBaz');
	assert.equal(camelCase(['', ''], {pascalCase: true}), '');
	assert.equal(camelCase('--', {pascalCase: true}), '');
	assert.equal(camelCase('', {pascalCase: true}), '');
	assert.equal(camelCase('--__--_--_', {pascalCase: true}), '');
	assert.equal(camelCase(['---_', '--', '', '-_- '], {pascalCase: true}), '');
	assert.equal(camelCase('foo bar?', {pascalCase: true}), 'FooBar?');
	assert.equal(camelCase('foo bar!', {pascalCase: true}), 'FooBar!');
	assert.equal(camelCase('foo bar$', {pascalCase: true}), 'FooBar$');
	assert.equal(camelCase('foo-bar#', {pascalCase: true}), 'FooBar#');
	assert.equal(camelCase('XMLHttpRequest', {pascalCase: true}), 'XmlHttpRequest');
	assert.equal(camelCase('AjaxXMLHttpRequest', {pascalCase: true}), 'AjaxXmlHttpRequest');
	assert.equal(camelCase('Ajax-XMLHttpRequest', {pascalCase: true}), 'AjaxXmlHttpRequest');
	assert.equal(camelCase([], {pascalCase: true}), '');
	assert.equal(camelCase('mGridCol6@md', {pascalCase: true}), 'MGridCol6@md');
	assert.equal(camelCase('A::a', {pascalCase: true}), 'A::a');
	assert.equal(camelCase('Hello1World', {pascalCase: true}), 'Hello1World');
	assert.equal(camelCase('Hello11World', {pascalCase: true}), 'Hello11World');
	assert.equal(camelCase('hello1world', {pascalCase: true}), 'Hello1World');
	assert.equal(camelCase('hello1World', {pascalCase: true}), 'Hello1World');
	assert.equal(camelCase('hello1', {pascalCase: true}), 'Hello1');
	assert.equal(camelCase('Hello1', {pascalCase: true}), 'Hello1');
	assert.equal(camelCase('1hello', {pascalCase: true}), '1Hello');
	assert.equal(camelCase('1Hello', {pascalCase: true}), '1Hello');
	assert.equal(camelCase('h1W', {pascalCase: true}), 'H1W');
	assert.equal(camelCase('РозовыйПушистыйЕдинороги', {pascalCase: true}), 'РозовыйПушистыйЕдинороги');
	assert.equal(camelCase('розовый_пушистый-единороги', {pascalCase: true}), 'РозовыйПушистыйЕдинороги');
	assert.equal(camelCase('РОЗОВЫЙ_ПУШИСТЫЙ-ЕДИНОРОГИ', {pascalCase: true}), 'РозовыйПушистыйЕдинороги');
	assert.equal(camelCase('桑德在这里。', {pascalCase: true}), '桑德在这里。');
	assert.equal(camelCase('桑德_在这里。', {pascalCase: true}), '桑德在这里。');
	assert.equal(camelCase('a1b', {pascalCase: true}), 'A1B');
});

test('camelCase with preserveConsecutiveUppercase option', () => {
	assert.equal(camelCase('foo-BAR', {preserveConsecutiveUppercase: true}), 'fooBAR');
	assert.equal(camelCase('Foo-BAR', {preserveConsecutiveUppercase: true}), 'fooBAR');
	assert.equal(camelCase('fooBAR', {preserveConsecutiveUppercase: true}), 'fooBAR');
	assert.equal(camelCase('fooBaR', {preserveConsecutiveUppercase: true}), 'fooBaR');
	assert.equal(camelCase('FOÈ-BAR', {preserveConsecutiveUppercase: true}), 'FOÈBAR');
	assert.equal(camelCase(['foo', 'BAR'], {preserveConsecutiveUppercase: true}), 'fooBAR');
	assert.equal(camelCase(['foo', '-BAR'], {preserveConsecutiveUppercase: true}), 'fooBAR');
	assert.equal(camelCase(['foo', '-BAR', 'baz'], {preserveConsecutiveUppercase: true}), 'fooBARBaz');
	assert.equal(camelCase(['', ''], {preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase('--', {preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase('', {preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase('--__--_--_', {preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase(['---_', '--', '', '-_- '], {preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase('foo BAR?', {preserveConsecutiveUppercase: true}), 'fooBAR?');
	assert.equal(camelCase('foo BAR!', {preserveConsecutiveUppercase: true}), 'fooBAR!');
	assert.equal(camelCase('foo BAR$', {preserveConsecutiveUppercase: true}), 'fooBAR$');
	assert.equal(camelCase('foo-BAR#', {preserveConsecutiveUppercase: true}), 'fooBAR#');
	assert.equal(camelCase('XMLHttpRequest', {preserveConsecutiveUppercase: true}), 'XMLHttpRequest');
	assert.equal(camelCase('AjaxXMLHttpRequest', {preserveConsecutiveUppercase: true}), 'ajaxXMLHttpRequest');
	assert.equal(camelCase('Ajax-XMLHttpRequest', {preserveConsecutiveUppercase: true}), 'ajaxXMLHttpRequest');
	assert.equal(camelCase([], {preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase('mGridCOl6@md', {preserveConsecutiveUppercase: true}), 'mGridCOl6@md');
	assert.equal(camelCase('A::a', {preserveConsecutiveUppercase: true}), 'a::a');
	assert.equal(camelCase('Hello1WORLD', {preserveConsecutiveUppercase: true}), 'hello1WORLD');
	assert.equal(camelCase('Hello11WORLD', {preserveConsecutiveUppercase: true}), 'hello11WORLD');
	assert.equal(camelCase('РозовыйПушистыйFOOдинорогиf', {preserveConsecutiveUppercase: true}), 'розовыйПушистыйFOOдинорогиf');
	assert.equal(camelCase('桑德在这里。', {preserveConsecutiveUppercase: true}), '桑德在这里。');
	assert.equal(camelCase('桑德_在这里。', {preserveConsecutiveUppercase: true}), '桑德在这里。');
	assert.equal(camelCase('IDs', {preserveConsecutiveUppercase: true}), 'iDs');
	assert.equal(camelCase('FooIDs', {preserveConsecutiveUppercase: true}), 'fooIDs');
});

test('camelCase with both pascalCase and preserveConsecutiveUppercase option', () => {
	assert.equal(camelCase('foo-BAR', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR');
	assert.equal(camelCase('fooBAR', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR');
	assert.equal(camelCase('fooBaR', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBaR');
	assert.equal(camelCase('fOÈ-BAR', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FOÈBAR');
	assert.equal(camelCase('--foo.BAR', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR');
	assert.equal(camelCase(['Foo', 'BAR'], {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR');
	assert.equal(camelCase(['foo', '-BAR'], {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR');
	assert.equal(camelCase(['foo', '-BAR', 'baz'], {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBARBaz');
	assert.equal(camelCase(['', ''], {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase('--', {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase('', {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase('--__--_--_', {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase(['---_', '--', '', '-_- '], {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase('foo BAR?', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR?');
	assert.equal(camelCase('foo BAR!', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR!');
	assert.equal(camelCase('Foo BAR$', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR$');
	assert.equal(camelCase('foo-BAR#', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR#');
	assert.equal(camelCase('xMLHttpRequest', {pascalCase: true, preserveConsecutiveUppercase: true}), 'XMLHttpRequest');
	assert.equal(camelCase('ajaxXMLHttpRequest', {pascalCase: true, preserveConsecutiveUppercase: true}), 'AjaxXMLHttpRequest');
	assert.equal(camelCase('Ajax-XMLHttpRequest', {pascalCase: true, preserveConsecutiveUppercase: true}), 'AjaxXMLHttpRequest');
	assert.equal(camelCase([], {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	assert.equal(camelCase('mGridCOl6@md', {pascalCase: true, preserveConsecutiveUppercase: true}), 'MGridCOl6@md');
	assert.equal(camelCase('A::a', {pascalCase: true, preserveConsecutiveUppercase: true}), 'A::a');
	assert.equal(camelCase('Hello1WORLD', {pascalCase: true, preserveConsecutiveUppercase: true}), 'Hello1WORLD');
	assert.equal(camelCase('Hello11WORLD', {pascalCase: true, preserveConsecutiveUppercase: true}), 'Hello11WORLD');
	assert.equal(camelCase('pозовыйПушистыйFOOдинорогиf', {pascalCase: true, preserveConsecutiveUppercase: true}), 'PозовыйПушистыйFOOдинорогиf');
	assert.equal(camelCase('桑德在这里。', {pascalCase: true, preserveConsecutiveUppercase: true}), '桑德在这里。');
	assert.equal(camelCase('桑德_在这里。', {pascalCase: true, preserveConsecutiveUppercase: true}), '桑德在这里。');
});

test('camelCase with locale option', () => {
	assert.equal(camelCase('lorem-ipsum', {locale: 'tr-TR'}), 'loremİpsum');
	assert.equal(camelCase('lorem-ipsum', {locale: 'en-EN'}), 'loremIpsum');
	assert.equal(camelCase('lorem-ipsum', {locale: ['tr', 'TR', 'tr-TR']}), 'loremİpsum');
	assert.equal(camelCase('lorem-ipsum', {locale: ['en-EN', 'en-GB']}), 'loremIpsum');
	assert.equal(camelCase('ipsum-dolor', {pascalCase: true, locale: 'tr-TR'}), 'İpsumDolor');
	assert.equal(camelCase('ipsum-dolor', {pascalCase: true, locale: 'en-EN'}), 'IpsumDolor');
	assert.equal(camelCase('ipsum-dolor', {pascalCase: true, locale: ['tr', 'TR', 'tr-TR']}), 'İpsumDolor');
	assert.equal(camelCase('ipsum-dolor', {pascalCase: true, locale: ['en-EN', 'en-GB']}), 'IpsumDolor');
});

/* eslint-disable no-extend-native -- Replaces the String.prototype locale methods so the test can prove they are unused. */
const withLocaleCaseFunctionsMocked = fn => {
	const throwWhenBeingCalled = () => {
		throw new Error('Should not be called');
	};

	const toLocaleUpperCase = Object.getOwnPropertyDescriptor(String.prototype, 'toLocaleUpperCase');
	const toLocaleLowerCase = Object.getOwnPropertyDescriptor(String.prototype, 'toLocaleLowerCase');

	Object.defineProperties(String.prototype, {
		toLocaleUpperCase: {
			...toLocaleUpperCase,
			value: throwWhenBeingCalled,
		},
		toLocaleLowerCase: {
			...toLocaleLowerCase,
			value: throwWhenBeingCalled,
		},
	});

	try {
		fn();
	} finally {
		Object.defineProperties(String.prototype, {
			toLocaleUpperCase,
			toLocaleLowerCase,
		});
	}
};
/* eslint-enable no-extend-native */

test('camelCase with disabled locale', () => {
	withLocaleCaseFunctionsMocked(() => {
		assert.equal(camelCase('lorem-ipsum', {locale: false}), 'loremIpsum');
		assert.equal(camelCase('ipsum-dolor', {pascalCase: true, locale: false}), 'IpsumDolor');
		assert.equal(camelCase('ipsum-DOLOR', {pascalCase: true, locale: false, preserveConsecutiveUppercase: true}), 'IpsumDOLOR');
	});
});

test('number handling follows Google Style Guide', () => {
	// Numbers don't create word boundaries (Google Java Style Guide)
	// https://google.github.io/styleguide/javaguide.html#s5.3-camel-case
	assert.equal(camelCase('turn_on_2sv', {capitalizeAfterNumber: false}), 'turnOn2sv'); // NOT turnOn2Sv
	assert.equal(camelCase('a1b_text', {capitalizeAfterNumber: false}), 'a1bText'); // NOT a1BText
	assert.equal(camelCase('foo2bar', {capitalizeAfterNumber: false}), 'foo2bar'); // NOT foo2Bar
	assert.equal(camelCase('version2', {capitalizeAfterNumber: false}), 'version2');

	// With pascalCase
	assert.equal(camelCase('turn_on_2sv', {pascalCase: true, capitalizeAfterNumber: false}), 'TurnOn2sv');
	assert.equal(camelCase('a1b_text', {pascalCase: true, capitalizeAfterNumber: false}), 'A1bText');
});

test('camelCase with capitalizeAfterNumber option', () => {
	assert.equal(camelCase('Hello1World'), 'hello1World');
	assert.equal(camelCase('Hello1World', {capitalizeAfterNumber: false}), 'hello1World'); // Preserves uppercase W
	assert.equal(camelCase('foo2bar'), 'foo2Bar');
	assert.equal(camelCase('foo2bar', {capitalizeAfterNumber: false}), 'foo2bar');
	assert.equal(camelCase('hello1world'), 'hello1World');
	assert.equal(camelCase('hello1world', {capitalizeAfterNumber: false}), 'hello1world'); // Preserves lowercase w
	assert.equal(camelCase('turn_on_2sv'), 'turnOn2Sv');
	assert.equal(camelCase('turn_on_2sv', {capitalizeAfterNumber: false}), 'turnOn2sv');

	assert.equal(camelCase('Hello1World', {pascalCase: true}), 'Hello1World');
	assert.equal(camelCase('Hello1World', {pascalCase: true, capitalizeAfterNumber: false}), 'Hello1World'); // Preserves uppercase W
	assert.equal(camelCase('turn_on_2sv', {pascalCase: true}), 'TurnOn2Sv');
	assert.equal(camelCase('turn_on_2sv', {pascalCase: true, capitalizeAfterNumber: false}), 'TurnOn2sv');
});

test('capitalizeAfterNumber edge cases', () => {
	assert.equal(camelCase('foo-2bar'), 'foo2Bar');
	assert.equal(camelCase('foo-2bar', {capitalizeAfterNumber: false}), 'foo2bar');
	assert.equal(camelCase('foo-2bar', {pascalCase: true}), 'Foo2Bar');
	assert.equal(camelCase('foo-2bar', {pascalCase: true, capitalizeAfterNumber: false}), 'Foo2bar');

	assert.equal(camelCase('2foo-bar'), '2FooBar');
	assert.equal(camelCase('2foo-bar', {capitalizeAfterNumber: false}), '2fooBar');
	assert.equal(camelCase('2foo-bar', {pascalCase: true}), '2FooBar');
	assert.equal(camelCase('2foo-bar', {pascalCase: true, capitalizeAfterNumber: false}), '2fooBar');

	assert.equal(camelCase('XML2HTTP'), 'xml2Http');
	assert.equal(camelCase('XML2HTTP', {capitalizeAfterNumber: false}), 'xml2Http'); // Preserves uppercase H
	assert.equal(camelCase('XML2HTTP', {pascalCase: true}), 'Xml2Http');
	assert.equal(camelCase('XML2HTTP', {pascalCase: true, capitalizeAfterNumber: false}), 'Xml2Http'); // Preserves uppercase H

	assert.equal(camelCase('2a'), '2A');
	assert.equal(camelCase('2a', {capitalizeAfterNumber: false}), '2a');
	assert.equal(camelCase('2a', {pascalCase: true}), '2A');
	assert.equal(camelCase('2a', {pascalCase: true, capitalizeAfterNumber: false}), '2a');

	assert.equal(camelCase('foo2BAR', {preserveConsecutiveUppercase: true}), 'foo2BAR');
	assert.equal(camelCase('foo2BAR', {preserveConsecutiveUppercase: true, capitalizeAfterNumber: false}), 'foo2BAR');
});

test('capitalizeAfterNumber: false keeps preserveConsecutiveUppercase intact', () => {
	// `capitalizeAfterNumber` is documented as only affecting letters that follow digits, so it must not change anything else. Apart from `a1B`, whose letter after the digit is already uppercase, these inputs have no digits, so both settings must agree.
	const assertSameWithAndWithoutNumberHandling = (input, options) => {
		assert.equal(
			camelCase(input, {...options, capitalizeAfterNumber: false}),
			camelCase(input, options),
			JSON.stringify(input),
		);
	};

	for (const input of [
		'a@B',
		'a$B',
		'a+B',
		'a=B',
		'a~B',
		'x#Y',
		'foo!Bar',
		'foo?Bar',
		'foo%Bar',
		'foo(Bar',
		'中B',
		'a.Bar',
		'a1B',
		'AB',
		'aB',
		'IDs',
		'FooIDs',
		'foo🦄Bar',
	]) {
		assertSameWithAndWithoutNumberHandling(input, {});
		assertSameWithAndWithoutNumberHandling(input, {pascalCase: true});
		assertSameWithAndWithoutNumberHandling(input, {preserveConsecutiveUppercase: true});
		assertSameWithAndWithoutNumberHandling(input, {pascalCase: true, preserveConsecutiveUppercase: true});
	}

	// Spelled out, so a regression points at the specific behaviour.
	assert.equal(camelCase('foo!Bar', {preserveConsecutiveUppercase: true}), 'foo!Bar');
	assert.equal(camelCase('foo!Bar', {preserveConsecutiveUppercase: true, capitalizeAfterNumber: false}), 'foo!Bar');
	assert.equal(camelCase('a@B', {preserveConsecutiveUppercase: true, capitalizeAfterNumber: false}), 'a@B');
	assert.equal(camelCase('a@B', {preserveConsecutiveUppercase: true}), 'a@B');

	// A lone leading capital is still lowercased, exactly like the `capitalizeAfterNumber: true` path.
	assert.equal(camelCase('AB', {preserveConsecutiveUppercase: true, capitalizeAfterNumber: false}), 'AB');
	assert.equal(camelCase('FooIDs', {preserveConsecutiveUppercase: true, capitalizeAfterNumber: false}), 'fooIDs');
});

test('capitalizeAfterNumber stops at a separator that follows the letter', () => {
	// The letter after a digit run is only capitalized when it is not itself followed by a separator. This is what keeps `b2b_registration` from turning into `b2BRegistration`.
	assert.equal(camelCase('1a'), '1A');
	assert.equal(camelCase('1a.'), '1a');
	assert.equal(camelCase('1a-'), '1a');
	assert.equal(camelCase('1a '), '1A'); // The trailing space is trimmed before the check.
	assert.equal(camelCase('2c'), '2C');
	assert.equal(camelCase('2c.'), '2c');
	assert.equal(camelCase('x1y'), 'x1Y');
	assert.equal(camelCase('x1y.z'), 'x1yZ');

	// A longer separator run behaves the same way as a single one.
	assert.equal(camelCase('1a..'), '1a');
	assert.equal(camelCase('1a.b'), '1aB');

	// The token is only left alone when a separator directly follows the letter, not further on.
	assert.equal(camelCase('foo1bar_baz'), 'foo1BarBaz');
	assert.equal(camelCase('foo1bar-baz'), 'foo1BarBaz');

	// Digits that are not followed by a letter never trigger a capitalization.
	assert.equal(camelCase('foo1'), 'foo1');
	assert.equal(camelCase('foo1_'), 'foo1');
	assert.equal(camelCase('1'), '1');
});

test('case preservation after numbers (capitalizeAfterNumber: false)', () => {
	// When capitalizeAfterNumber is false, original case is preserved
	assert.equal(camelCase('Textures_3d', {capitalizeAfterNumber: false}), 'textures3d'); // Preserves lowercase d
	assert.equal(camelCase('Textures_3D', {capitalizeAfterNumber: false}), 'textures3D'); // Preserves uppercase D
	assert.equal(camelCase('version_1a', {capitalizeAfterNumber: false}), 'version1a');
	assert.equal(camelCase('version_1A', {capitalizeAfterNumber: false}), 'version1A');
	assert.equal(camelCase('foo_2_bar', {capitalizeAfterNumber: false}), 'foo2Bar'); // 'bar' is after separator, not directly after number

	// With pascalCase
	assert.equal(camelCase('Textures_3d', {pascalCase: true, capitalizeAfterNumber: false}), 'Textures3d');
	assert.equal(camelCase('Textures_3D', {pascalCase: true, capitalizeAfterNumber: false}), 'Textures3D');
});

test('preserve leading underscores and dollar signs', () => {
	// Leading _ and $ have semantic meaning (private/internal, jQuery/observables)
	assert.equal(camelCase('_foo_bar'), '_fooBar');
	assert.equal(camelCase('$foo_bar'), '$fooBar');
	assert.equal(camelCase('__foo_bar'), '__fooBar');
	assert.equal(camelCase('$$foo_bar'), '$$fooBar');
	assert.equal(camelCase('$_foo_bar'), '$_fooBar');
	assert.equal(camelCase('_$foo_bar'), '_$fooBar');

	// Edge cases: only prefix characters
	assert.equal(camelCase('_'), '_');
	assert.equal(camelCase('__'), '__');
	assert.equal(camelCase('$'), '$');
	assert.equal(camelCase('$$$'), '$$$');
	assert.equal(camelCase('_$'), '_$');

	// With pascalCase
	assert.equal(camelCase('_foo_bar', {pascalCase: true}), '_FooBar');
	assert.equal(camelCase('$foo_bar', {pascalCase: true}), '$FooBar');
	assert.equal(camelCase('__foo_bar', {pascalCase: true}), '__FooBar');

	// With preserveConsecutiveUppercase
	assert.equal(camelCase('_foo_BAR', {preserveConsecutiveUppercase: true}), '_fooBAR');
	assert.equal(camelCase('$foo_BAR', {preserveConsecutiveUppercase: true}), '$fooBAR');

	// Combined with other transformations
	assert.equal(camelCase('_foo-bar_baz'), '_fooBarBaz');
	assert.equal(camelCase('$http_service'), '$httpService');
});

test('astral plane letters behave like their basic plane counterparts', () => {
	// The Osage capital/small letter A. Both need a surrogate pair, so they exercise every place where the code could mistake a code unit for a character.
	const capital = '\u{104B0}';
	const small = '\u{104D8}';

	// Swapping the astral pair for a basic plane pair must give the same answer, so the only thing under test is the code point handling, not the choice of letter. `X`/`x` stands in for the astral pair; no other letter in the inputs below collides with it.
	const toAstral = string => string.replaceAll(/X|x/gv, match => (match === 'X' ? capital : small));
	const assertMirrorsBasicPlane = (astralInput, basicInput, options) => {
		assert.equal(
			camelCase(astralInput, options),
			toAstral(camelCase(basicInput, options)),
			`${JSON.stringify(astralInput)} ${JSON.stringify(options)}`,
		);
	};

	for (const basicInput of [
		'X',
		'x',
		'xbar',
		'Xbar',
		'XXbar',
		'fooXbar',
		'fooXXbar',
		'aXb',
		'aXX',
		'x x',
		'X-X',
		'1X2',
		'X1x',
		'foo_X_bar',
		'xxxX',
	]) {
		const astralInput = toAstral(basicInput);
		for (const options of booleanOptionSets) {
			assertMirrorsBasicPlane(astralInput, basicInput, options);
		}
	}

	// Spelled out, so a regression points at a specific behaviour instead of only at the mirror.
	assert.equal(camelCase(`${small}bar`, {pascalCase: true}), `${capital}bar`);
	assert.equal(camelCase(`a${capital}`), `a${capital}`);
	assert.equal(camelCase(`a${capital}b`), `a${capital}b`);
	assert.equal(camelCase(`a${capital}b`, {pascalCase: true}), `A${capital}b`);
	assert.equal(camelCase(`foo${capital}bar`), `foo${capital}bar`);
	assert.equal(camelCase(`${capital}${capital}bar`, {preserveConsecutiveUppercase: true}), `${small}${capital}bar`);

	// A leading prefix is cut off before the first character is uppercased, so the character that gets uppercased is the one after it, not the prefix and not half of a surrogate pair.
	assert.equal(camelCase(`_${small}`, {pascalCase: true}), `_${capital}`);
	assert.equal(camelCase(`$${small}`, {pascalCase: true}), `$${capital}`);
});

test('edge cases: emoji and unicode', () => {
	// Emoji treated as non-separator special character
	assert.equal(camelCase('foo-🦄-bar'), 'foo-🦄Bar');
	assert.equal(camelCase('foo🦄bar'), 'foo🦄bar');

	// Zero-width characters preserved
	assert.equal(camelCase('foo\u{200D}bar'), 'foo\u{200D}bar');

	// RTL languages
	assert.equal(camelCase('foo_مرحبا_bar'), 'fooمرحباBar');
	assert.equal(camelCase('foo_שלום_bar'), 'fooשלוםBar');
});

test('edge cases: combined options', () => {
	// All options together
	assert.equal(camelCase('foo_2BAR_baz', {pascalCase: true, preserveConsecutiveUppercase: true, capitalizeAfterNumber: false}), 'Foo2BARBaz');

	// Leading prefix with all options
	assert.equal(camelCase('__foo_2BAR', {pascalCase: true, preserveConsecutiveUppercase: true, capitalizeAfterNumber: false}), '__Foo2BAR');
	assert.equal(camelCase('$_foo_BAR', {pascalCase: true, preserveConsecutiveUppercase: true}), '$_FooBAR');
});

test('edge cases: numbers', () => {
	// Decimal numbers (dots are separators)
	assert.equal(camelCase('version_3.14.15'), 'version31415');

	// Negative sign is special character
	assert.equal(camelCase('temp_-5_degrees'), 'temp5Degrees');

	// Only numbers
	assert.equal(camelCase('123'), '123');
	assert.equal(camelCase('123_456_789'), '123456789');
});

test('edge cases: locale with capitalizeAfterNumber', () => {
	// Turkish i/İ with numbers and capitalizeAfterNumber
	assert.equal(camelCase('test_1i', {locale: 'tr-TR'}), 'test1İ');
	assert.equal(camelCase('test_1i', {locale: 'tr-TR', capitalizeAfterNumber: false}), 'test1i');

	// Empty locale array falls back to default
	assert.equal(camelCase('foo-bar', {locale: []}), 'fooBar');
});

test('edge cases: special characters', () => {
	// Multiple consecutive special chars
	assert.equal(camelCase('foo##bar'), 'foo##bar');
	assert.equal(camelCase('foo@#$bar'), 'foo@#$bar');

	// Mixed separators and special chars
	assert.equal(camelCase('foo_@#_bar'), 'foo_@#Bar');

	// A separator run with no identifier behind it is left in the output rather than swallowed, so a trailing `-` survives. The run is deliberately not made atomic, because doing so would also drop the trailing `_` of `a-_-!`, where that `_` is the identifier.
	assert.equal(camelCase('a-!'), 'a-!');
	assert.equal(camelCase('a-_-!'), 'a_-!');
});

test('edge cases: array input', () => {
	// Array with leading prefixes
	assert.equal(camelCase(['_foo', '$bar']), '_foo-$bar');

	// Array with only whitespace elements
	assert.equal(camelCase(['  ', '  foo  ', '  ']), 'foo');
	assert.equal(camelCase(['', '  ', '']), '');
});

test('edge cases: uppercase transitions', () => {
	// Multiple rapid transitions
	assert.equal(camelCase('aAbBcC'), 'aAbBcC');
	assert.equal(camelCase('a1A2B3C'), 'a1A2B3C');

	// Single uppercase with preserveConsecutiveUppercase
	assert.equal(camelCase('fooAbar', {preserveConsecutiveUppercase: true}), 'fooAbar');
	assert.equal(camelCase('A', {preserveConsecutiveUppercase: true}), 'a');
});

test('edge cases: extreme inputs', () => {
	// Very long separator sequences
	const longPrefix = '_'.repeat(50);
	assert.equal(camelCase(longPrefix + 'foo' + longPrefix + 'bar'), longPrefix + 'fooBar');

	// Mixed repeated separators
	assert.equal(camelCase('_-. _-. _-.foo'), '_foo');

	// Only separators
	assert.equal(camelCase('-_.  -_. -_.'), '');
});

test('pascalCase only ever changes the first character', () => {
	// Whichever way the word boundaries fall, PascalCase is the camelCase result with the first character uppercased. Anything else means an option is leaking into unrelated characters. The locale is honoured, so that this only tests the first character and not the case mapping.
	const upperFirstCodePoint = (string, locale) => {
		const [firstCharacter, ...rest] = [...string];
		if (firstCharacter === undefined) {
			return string;
		}

		const uppercased = locale === false
			? firstCharacter.toUpperCase()
			: firstCharacter.toLocaleUpperCase(locale);
		return uppercased + rest.join('');
	};

	// No `İ` here: lowercasing it expands it to `i` + U+0307, which does not recompose when uppercased again, while pascalCase uppercases the original and keeps the precomposed form.
	const inputs = [
		'foo-bar',
		'fooBar',
		'FOOBar',
		'a',
		'A',
		'1',
		'1a',
		'a1b',
		'a1b.',
		'a b',
		'a..b',
		'--a--b--',
		'IDs',
		'FooIDs',
		'XMLHttpRequest',
		'розовый_пушистый',
		'b2b_registration',
		'hello world',
		'x1y.z',
		'AB',
		'ABc',
		'ABCd',
		'2c',
		'2c.',
		'foo!Bar',
		'a@B',
		'中B',
		'🦄bar',
		'a🦄b',
		'foo_@#_bar',
		'123_456',
		'v1.2.3-beta.1',
		'ΟΔΟΣ',
		'straße',
		'Ǆungla',
	];

	const optionSets = [
		...camelCaseOptionSets,
		{locale: false},
		{locale: 'tr-TR'},
	];

	const mismatches = collectMismatches(20);
	for (const input of inputs) {
		for (const options of optionSets) {
			const actual = camelCase(input, {...options, pascalCase: true});
			const expected = upperFirstCodePoint(camelCase(input, options), options.locale);
			mismatches.record(
				actual === expected,
				() => `${JSON.stringify(input)} ${JSON.stringify(options)}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`,
			);
		}
	}

	assert.equal(mismatches.total, 0, mismatches.report());
});

test('the result follows the documented rules, checked against them directly', () => {
	// For input with no case to preserve, the whole job is: split on the separator runs, lowercase, capitalize the first character of every word but the first, and capitalize the first letter after a run of decimal digits unless a separator comes right after that letter. Stating the rules like this and checking against them means a change in the word detection or the digit rule shows up on its own, instead of as one more expected value to update.
	const reference = input => {
		const trimmed = input.trim();
		if (trimmed === '') {
			return '';
		}

		const prefix = /^[$_]*/v.exec(trimmed)[0];
		// Spread before slicing, so this is a code point list rather than a code unit list. The prefix is ASCII, so its length is the same in both.
		const characters = [...trimmed].slice(prefix.length);
		const isSeparatorAt = index => index >= 0 && index < characters.length && SEPARATORS.test(characters[index]);

		// Which word each surviving character belongs to, counting from zero.
		const wordAt = Array.from({length: characters.length}, () => -1);
		let word = -1;
		for (let index = 0; index < characters.length; index++) {
			if (isSeparatorAt(index)) {
				continue; // A run is dropped, it does not open a word.
			}

			if (index === 0 || isSeparatorAt(index - 1)) {
				word++;
			}

			wordAt[index] = word;
		}

		const capitalize = new Set();
		for (let index = 0; index < characters.length; index++) {
			if (wordAt[index] > 0 && (index === 0 || isSeparatorAt(index - 1))) {
				capitalize.add(index);
			}
		}

		// A letter straight after a digit run, unless a separator comes right after the letter.
		let hadDigit = false;
		for (const [index, character] of characters.entries()) {
			if (DIGIT.test(character)) {
				hadDigit = true;
				continue;
			}

			if (!hadDigit) {
				continue;
			}

			hadDigit = false;
			if (!isSeparatorAt(index) && !isSeparatorAt(index + 1) && ALPHABETIC.test(character)) {
				capitalize.add(index);
			}
		}

		let result = '';
		for (const [index, character] of characters.entries()) {
			if (isSeparatorAt(index)) {
				continue;
			}

			result += capitalize.has(index) ? character.toUpperCase() : character.toLowerCase();
		}

		return prefix + result;
	};

	// PascalCase only uppercases the first character of that, after the leading prefix.
	const withPascalCase = input => {
		const result = reference(input);
		const prefix = /^[$_]*/v.exec(result)[0];
		const rest = result.slice(prefix.length);
		return prefix + rest.charAt(0).toUpperCase() + rest.slice(1);
	};

	const words = ['foo', 'bar', 'a', 'bc'];
	const separatorRuns = ['', '-', '_', '.', ' ', '-_', '1', '١'];

	// A chunk is a word followed by a run, so a three word input is three chunks. Keeping the nesting this shallow matters: the loop below runs once per combination.
	const chunks = words.flatMap(word => separatorRuns.map(run => word + run));

	// One place picks the right answer and formats a failure, so the loops below stay a plain cross product. Both strings are computed up front rather than inside the reporter, which only runs once something has already gone wrong.
	const mismatches = collectMismatches(20);
	const check = (input, options) => {
		const actual = camelCase(input, options);
		const expected = options.pascalCase ? withPascalCase(input) : reference(input);
		mismatches.record(
			actual === expected,
			() => `${JSON.stringify(input)} ${JSON.stringify(options)}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`,
		);
	};

	for (const first of chunks) {
		for (const second of chunks) {
			for (const third of chunks) {
				check(first + second + third, {});
			}
		}
	}

	// Leading and trailing runs drive the leading `$_` prefix, and runs longer than two or mixing separator kinds are the ones the greedy match has to back through, so check those directly.
	for (const run of [...separatorRuns, '--', '__', '..', ' '.repeat(2), '___', '.-', ' . ', '...', '---', '_._', ' - . ']) {
		for (const word of words) {
			for (const input of [run + word, run + word + run, run + run + word, run + word + run + word + run]) {
				check(input, {});
				check(input, {pascalCase: true});
			}
		}
	}

	assert.equal(mismatches.total, 0, mismatches.report());
});

test('a single character input is taken on its own', () => {
	// One character is too short to have a word boundary in it, so it is uppercased or lowercased directly and never reaches the separator and digit passes. The characters below are the ones where that is visible, because their case mapping does not round trip.
	assert.equal(camelCase('a'), 'a');
	assert.equal(camelCase('A'), 'a');
	assert.equal(camelCase('A', {pascalCase: true}), 'A');
	assert.equal(camelCase('1'), '1');
	assert.equal(camelCase('🦄'), '🦄');

	// U+1C5 is titlecase, not uppercase, so nothing is left for `preserveConsecutiveUppercase` to preserve and the character is simply lowercased. U+2164 behaves the same way.
	assert.equal(camelCase('\u{1C5}', {preserveConsecutiveUppercase: true}), '\u{1C6}');
	assert.equal(camelCase('\u{2164}', {preserveConsecutiveUppercase: true}), '\u{2174}');

	// U+1E9E is capital sharp s. Uppercasing it is a no-op, so PascalCase keeps the capital where the camelCase result has the small letter.
	assert.equal(camelCase('\u{1E9E}'), '\u{DF}');
	assert.equal(camelCase('\u{1E9E}', {pascalCase: true}), '\u{1E9E}');

	// A lone separator is the one character with no identifier behind it, so it is dropped on its own, and a leading prefix in front of it is all that is left.
	assert.equal(camelCase('-'), '');
	assert.equal(camelCase('_-'), '_');
	assert.equal(camelCase('$-'), '$');
});

test('every decimal digit counts as a number, not just the ASCII ones', () => {
	// `capitalizeAfterNumber` is documented as capitalizing the letter after a *numeric sequence*. U+0661, U+06F1, U+FF11 and U+0969 are decimal digits like 1 is, and the identifier class in index.js already counts them, so the digit run has to count them too.
	const digits = ['\u{661}', '\u{6F1}', '\u{FF11}', '\u{969}', '\u{F22}', '\u{0BE6}', '\u{0C66}'];

	const optionSets = [
		{},
		{pascalCase: true},
		{capitalizeAfterNumber: false},
		{pascalCase: true, capitalizeAfterNumber: false},
		{preserveConsecutiveUppercase: true},
	];

	const shapes = [
		['1foo', digit => `${digit}foo`],
		['foo1bar', digit => `foo${digit}bar`],
		['1A', digit => `${digit}A`],
		['foo1bar_baz', digit => `foo${digit}bar_baz`],
		['version_1a', digit => `version_${digit}a`],
	];

	const mismatches = collectMismatches(20);
	for (const digit of digits) {
		for (const options of optionSets) {
			for (const [asciiInput, withDigit] of shapes) {
				const input = withDigit(digit);
				// The digit itself survives into the output, so put it back to 1 to compare shapes.
				const actual = camelCase(input, options).replaceAll(digit, '1');
				mismatches.record(
					actual === camelCase(asciiInput, options),
					() => `${JSON.stringify(input)} ${JSON.stringify(options)}: got ${JSON.stringify(actual)}, want ${JSON.stringify(camelCase(asciiInput, options))}`,
				);
			}
		}
	}

	// And the same for every decimal digit in the Unicode range, not just the ones above.
	// 0x10FFFF, the last code point, written the way the numeric separator rule wants it.
	const lastCodePoint = 1_114_111;

	for (let codePoint = 0x30; codePoint <= lastCodePoint; codePoint++) {
		if (codePoint >= 0xD8_00 && codePoint <= 0xDF_FF) {
			continue;
		}

		const character = String.fromCodePoint(codePoint);
		if (character === '1' || !/\p{Decimal_Number}/v.test(character)) {
			continue;
		}

		for (const [asciiInput, input] of [['1foo', `${character}foo`], ['a1b', `a${character}b`]]) {
			const actual = camelCase(input).replaceAll(character, '1');
			mismatches.record(actual === camelCase(asciiInput), () => `U+${codePoint.toString(16)}: got ${JSON.stringify(actual)}, want ${JSON.stringify(camelCase(asciiInput))}`);
		}
	}

	assert.equal(mismatches.total, 0, mismatches.report());

	// Only decimal digits. These are \p{Number} but not decimal digits, so they are not a digit run and the letter after one is not capitalized, exactly as before. The Roman numeral five is cased, so it lowercases; the other two are uncased and pass through.
	assert.equal(camelCase('\u{B2}foo'), '\u{B2}foo');
	assert.equal(camelCase('foo\u{B2}bar'), 'foo\u{B2}bar');
	assert.equal(camelCase('\u{2164}foo'), '\u{2174}foo');
	assert.equal(camelCase('foo\u{2164}bar'), 'foo\u{2174}bar');
	assert.equal(camelCase('\u{3007}foo'), '\u{3007}foo');
	assert.equal(camelCase('foo\u{3007}bar'), 'foo\u{3007}bar');
});

test('a letter after a separator is not a letter after a digit', () => {
	// `capitalizeAfterNumber: false` preserves the case of a letter that immediately follows a digit and lowercases everything else. A letter that follows a *separator* is the second kind, even when digits came before the separator, so it has to be lowercased.
	//
	// The difference only shows for a character whose round trip through lowercasing is not the identity. U+03F4 is one: it is an Uppercase_Letter whose uppercase is itself but whose lowercase is U+03B8, whose uppercase is U+0398. Preserving it leaves an uppercase letter in the output; lowercasing it and capitalizing it afterwards gives the other capital theta.
	assert.equal(camelCase('1-\u{3F4}'), '1\u{398}');
	assert.equal(camelCase('1-\u{3F4}', {capitalizeAfterNumber: false}), '1\u{398}');
	assert.equal(camelCase('1 \u{3F4}', {capitalizeAfterNumber: false}), '1\u{398}');
	assert.equal(camelCase('1_\u{3F4}', {capitalizeAfterNumber: false}), '1\u{398}');
	assert.equal(camelCase('1-\u{3F4}', {pascalCase: true, capitalizeAfterNumber: false}), '1\u{398}');

	// U+0130 lowercases to `i` plus U+0307, so the two paths differ in normalization only.
	assert.equal(camelCase('9-\u{130}'), '9\u{49}\u{307}');
	assert.equal(camelCase('9-\u{130}', {capitalizeAfterNumber: false}), '9\u{49}\u{307}');

	// A letter that really is right after a digit still keeps its case.
	assert.equal(camelCase('1\u{3F4}', {capitalizeAfterNumber: false}), '1\u{3F4}');
	assert.equal(camelCase('1hello', {capitalizeAfterNumber: false}), '1hello');
});

test('the two capitalizeAfterNumber settings agree when there is no digit', () => {
	// The option is documented as only affecting a letter that immediately follows a digit, so with no digit in the input the two settings have to produce the same string. Checked over every three character combination from this alphabet, which is exhaustive for that length.
	//
	// No decimal digit, because that is the case the option is about. No U+03A3 and no cased character that is not Uppercase_Letter (such as a titlecase letter) either: those are the two limitations documented in index.js.
	const characters = [
		'a',
		'B',
		'ß',
		'İ',
		'ⅴ',
		'\u{104B0}',
		'́',
		'-',
		'_',
		' ',
		'@',
		'²',
	];

	// A narrow subset, because this one runs a cross product and every extra option set is another pass over all of it.
	const optionSets = [...singleOptionSets, {locale: 'tr-TR'}];

	const mismatches = collectMismatches(20);
	for (const first of characters) {
		for (const second of characters) {
			for (const third of characters) {
				const input = first + second + third;
				for (const options of optionSets) {
					const on = camelCase(input, options);
					const off = camelCase(input, {...options, capitalizeAfterNumber: false});
					mismatches.record(
						on === off,
						() => `${JSON.stringify(input)} ${JSON.stringify(options)}: true gives ${JSON.stringify(on)}, false gives ${JSON.stringify(off)}`,
					);
				}
			}
		}
	}

	assert.equal(mismatches.total, 0, mismatches.report());

	// The sweep above is only meaningful if the option can actually change the answer, so the difference it is looking for is shown here rather than left to the reader to construct.
	assert.equal(camelCase('a1b'), 'a1B');
	assert.equal(camelCase('a1b', {capitalizeAfterNumber: false}), 'a1b');
});

test('combining marks are kept and do not disturb the word boundaries of their base letter', () => {
	// A mark that follows a base letter is where marks actually occur, so decomposed text round trips as expected. A mark with no base letter is a documented limitation in index.js and is not pinned here.
	assert.equal(camelCase('a-b'), 'aB');
	assert.equal(camelCase('a1b'), 'a1B');

	// U+0345 COMBINING GREEK YPOGEGRAMMENI carries Other_Alphabetic, so it is an identifier and the boundary is found.
	assert.equal(camelCase('a-\u{345}b'), 'a\u{399}b');
	assert.equal(camelCase('caf\u{E9}-bar'), 'caf\u{E9}Bar');
	assert.equal(camelCase('cafe\u{301}-bar'), 'cafe\u{301}Bar');

	// A mark on the base letter before a separator never interferes.
	assert.equal(camelCase('a\u{301}-b'), 'a\u{301}B');
	assert.equal(camelCase('a1b\u{301}'), 'a1B\u{301}');

	// No combining mark is ever dropped, whatever the input looks like.
	const MARKS = /\p{Mark}/v;
	const countMarks = string => [...string].filter(character => MARKS.test(character)).length;
	const dropped = collectMismatches(20);
	for (const input of ['a-\u{301}b', 'a1\u{301}b', 'a-\u{FE0F}b', 'a-\u{200D}b', 'a-\u{301}\u{302}b', 'a-\u{1F3FB}b']) {
		dropped.record(
			countMarks(camelCase(input)) === countMarks(input),
			() => `${JSON.stringify(input)}: marks went from ${countMarks(input)} to ${countMarks(camelCase(input))}`,
		);
	}

	assert.equal(dropped.total, 0, dropped.report());
});

test('context sensitive lowercasing and cased characters that are not Uppercase_Letter', () => {
	// U+03A3 is the only code point in Unicode whose lowercase mapping is context sensitive: at the end of a word it becomes the final sigma. The `capitalizeAfterNumber: false` path lowercases one character at a time and cannot reproduce that, which is a documented limitation in index.js and is not pinned here.
	assert.equal(camelCase('ΑΣ'), 'ας');
	assert.equal(camelCase('ΑΣΑ'), 'ασα');
	assert.equal(camelCase('ΑΣΑ', {capitalizeAfterNumber: false}), 'ασα');
	assert.equal(camelCase('Σ'), 'σ');
	assert.equal(camelCase('Σ', {capitalizeAfterNumber: false}), 'σ');

	// Titlecase letters, Roman numerals and circled capitals are cased without being Uppercase_Letter. One of each group:
	const casedButNotUppercase = [
		'\u{1C5}', // DZ with caron
		'\u{1F88}', // Greek small alpha with ypogegrammeni
		'\u{2164}', // Roman numeral five
		'\u{24B6}', // Circled capital A
	];

	const mismatches = collectMismatches(20);
	for (const character of casedButNotUppercase) {
		const id = `U+${character.codePointAt(0).toString(16).toUpperCase()}`;

		// The rest of this block is only meaningful while none of them is an Uppercase_Letter, so the premise is checked rather than assumed.
		mismatches.record(!/\p{Uppercase_Letter}/v.test(character), () => `${id} is an Uppercase_Letter after all`);

		// With preserveConsecutiveUppercase off, the two paths agree, because both lowercase it.
		mismatches.record(
			camelCase(`${character}foo`, {capitalizeAfterNumber: false}) === camelCase(`${character}foo`),
			() => `${id}: the two paths disagree with preserveConsecutiveUppercase off`,
		);

		// With preserveConsecutiveUppercase on, the default path leaves the string cased as it is.
		mismatches.record(
			camelCase(`${character}foo`, {preserveConsecutiveUppercase: true}) === `${character}foo`,
			() => `${id}: the default path did not keep it`,
		);
	}

	assert.equal(mismatches.total, 0, mismatches.report());
});

test('locales only matter for characters that actually have locale specific casing', () => {
	// The Turkish dotted and dotless I are the only characters where a locale changes the answer for ASCII-ish input, so every other locale must agree with en-US.
	const inputs = [
		'foo-bar',
		'fooBar',
		'lorem-ipsum',
		'I',
		'i',
		'ı',
		'İ',
		'ipsum-dolor',
		'A-b',
		'a-I-b',
		'I-i',
		'İ-ı',
		'x1y.z',
		'b2b_registration',
		'XMLHttpRequest',
		'foo I bar',
		'foo ı bar',
		'FOO-bar',
		'lorem-ipsum-dolor',
		'id',
		'ID',
		'iD',
		'ıd',
		'İd',
	];

	const optionSets = singleOptionSets;

	const comparisonLocales = ['de-DE', 'fr-FR', 'ja-JP', 'ru-RU', 'zh-CN', 'ar-EG', false];
	const mismatches = collectMismatches(20);
	for (const input of inputs) {
		for (const options of optionSets) {
			const baseline = camelCase(input, {...options, locale: 'en-US'});
			for (const locale of comparisonLocales) {
				const actual = camelCase(input, {...options, locale});
				mismatches.record(
					actual === baseline,
					() => `${JSON.stringify(input)} ${JSON.stringify(options)} ${locale}: got ${JSON.stringify(actual)}, want ${JSON.stringify(baseline)}`,
				);
			}
		}
	}

	assert.equal(mismatches.total, 0, mismatches.report());

	// And the Turkish locale does differ where it should.
	assert.equal(camelCase('ipsum', {locale: 'tr-TR'}), 'ipsum');
	assert.equal(camelCase('I', {locale: 'tr-TR'}), 'ı');
	assert.equal(camelCase('I', {locale: 'en-US'}), 'i');
	assert.equal(camelCase('ı', {locale: 'tr-TR'}), 'ı');
	assert.equal(camelCase('lorem-ipsum', {locale: 'tr-TR'}), 'loremİpsum');
	assert.equal(camelCase('ipsum-dolor', {pascalCase: true, locale: 'tr-TR'}), 'İpsumDolor');
	assert.equal(camelCase('lorem-ipsum', {locale: false}), 'loremIpsum');
});

test('array input joins the words with a separator', () => {
	// The array form is the string form with the words already split, so it has to land in the same place for every option combination.
	const mismatches = collectMismatches(20);
	for (const word of ['foo', 'bar', 'FOO', 'BAR', 'IDs', 'a1b', '2c', '中']) {
		for (const options of booleanOptionSets) {
			const single = camelCase([word], options);
			const singleString = camelCase(word, options);
			mismatches.record(
				single === singleString,
				() => `${JSON.stringify(word)} ${JSON.stringify(options)}: [${JSON.stringify(word)}] gave ${JSON.stringify(single)}, want ${JSON.stringify(singleString)}`,
			);

			const pair = camelCase([word, word], options);
			const pairString = camelCase(`${word}-${word}`, options);
			mismatches.record(
				pair === pairString,
				() => `${JSON.stringify(word)} ${JSON.stringify(options)}: [${JSON.stringify(word)}, ${JSON.stringify(word)}] gave ${JSON.stringify(pair)}, want ${JSON.stringify(pairString)}`,
			);
		}
	}

	assert.equal(mismatches.total, 0, mismatches.report());

	// Whitespace-only and empty elements drop out rather than becoming words. If one survived, it would contribute a separator, and that separator is observable: it suppresses the capitalization after a digit run and it pushes the leading `_`/`$` out of the prefix position.
	assert.equal(camelCase([' '.repeat(2), 'foo', '\t', 'bar', ' ']), 'fooBar');
	assert.equal(camelCase([' '.repeat(3)]), '');
	assert.equal(camelCase(['.', '-', '_']), '');
	assert.equal(camelCase([]), '');
	assert.equal(camelCase(['', '']), '');
	assert.equal(camelCase(['', '_foo']), '_foo');
	assert.equal(camelCase(['', '_foo'], {pascalCase: true}), '_Foo');
	assert.equal(camelCase(['', '$foo']), '$foo');
	assert.equal(camelCase(['1b', '']), '1B');
	assert.equal(camelCase(['a1b', '']), 'a1B');
	assert.equal(camelCase(['x', '1b', '']), 'x1B');
	assert.equal(camelCase(['1b', '', '1c']), '1b1C');
});

test('invalid input', () => {
	assert.throws(() => {
		camelCase(1);
	}, {
		message: /Expected the input to be/v,
	});
});
