import {test} from 'node:test';
import assert from 'node:assert/strict';
import camelCase from './index.js';

// Gathers failures of a property over a large cross product. Recording instead of asserting keeps
// the loop cheap, and the report shows the count plus a few examples so the output stays readable
// even when a whole family of inputs regresses at once.
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
	assert.equal(camelCase('--'), '');
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
	// Duplicate of the line above, carried over verbatim from the AVA suite. Kept so the
	// migration does not silently drop a case. Safe to delete.
	// eslint-disable-next-line node-test/no-duplicate-assertions
	assert.equal(camelCase('розовый_пушистый-единороги'), 'розовыйПушистыйЕдинороги');
	assert.equal(camelCase('РОЗОВЫЙ_ПУШИСТЫЙ-ЕДИНОРОГИ'), 'розовыйПушистыйЕдинороги');
	assert.equal(camelCase('桑德在这里。'), '桑德在这里。');
	// Duplicate of the line above, carried over verbatim from the AVA suite. Kept so the
	// migration does not silently drop a case. Safe to delete.
	// eslint-disable-next-line node-test/no-duplicate-assertions
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

test('capitalizeAfterNumber stops at a separator that follows the letter', () => {
	// The letter after a digit run is only capitalized when it is not itself followed by a
	// separator. This is what keeps `b2b_registration` from turning into `b2BRegistration`.
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
	// Whichever way the word boundaries fall, PascalCase is the camelCase result with the first
	// character uppercased. Anything else means an option is leaking into unrelated characters.
	// The locale is honoured, so that this only tests the first character and not the case mapping.
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

	// No `İ` here: lowercasing it expands it to `i` + U+0307, which does not recompose when
	// uppercased again, while pascalCase uppercases the original and keeps the precomposed form.
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
		{},
		{preserveConsecutiveUppercase: true},
		{capitalizeAfterNumber: false},
		{preserveConsecutiveUppercase: true, capitalizeAfterNumber: false},
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

test('lowercase words separated by separators only capitalize word starts', () => {
	// With no case to preserve and no digits to treat as boundaries, the job is just "split on the
	// separator runs, lowercase, capitalize every word but the first". Checked against that directly
	// so a change in the word detection shows up on its own.
	const reference = input => {
		const trimmed = input.trim();
		if (trimmed === '') {
			return '';
		}

		const prefix = /^[$_]*/v.exec(trimmed)[0];
		const words = trimmed
			.slice(prefix.length)
			.split(/[ \-._]+/v)
			.filter(word => word !== '');

		if (words.length === 0) {
			return prefix;
		}

		return prefix + words
			.map((word, index) => (index === 0 ? word : word[0].toUpperCase() + word.slice(1)))
			.join('');
	};

	const words = ['foo', 'bar', 'baz', 'a', 'bc'];
	const separatorRuns = ['', '-', '_', '.', ' ', '-_'];

	// A chunk is a word followed by a separator run, so a three word input is three chunks. Keeping
	// the nesting this shallow matters: the loop below runs once per combination.
	const chunks = words.flatMap(word => separatorRuns.map(run => word + run));

	const mismatches = collectMismatches(20);
	for (const first of chunks) {
		for (const second of chunks) {
			for (const third of chunks) {
				const input = first + second + third;
				const actual = camelCase(input);
				mismatches.record(
					actual === reference(input),
					() => `${JSON.stringify(input)}: got ${JSON.stringify(actual)}, want ${JSON.stringify(reference(input))}`,
				);
			}
		}
	}

	// Leading and trailing runs drive the leading `$_` prefix, and runs longer than two or mixing
	// separator kinds are the ones the greedy match has to back through, so check those directly.
	for (const run of [...separatorRuns, '--', '__', '..', ' '.repeat(2), '___', '.-', ' . ', '...', '---', '_._', ' - . ']) {
		for (const word of words) {
			for (const input of [run + word, run + word + run, run + run + word, run + word + run + word + run]) {
				const actual = camelCase(input);
				mismatches.record(
					actual === reference(input),
					() => `${JSON.stringify(input)}: got ${JSON.stringify(actual)}, want ${JSON.stringify(reference(input))}`,
				);
			}
		}
	}

	assert.equal(mismatches.total, 0, mismatches.report());
});

test('locales only matter for characters that actually have locale specific casing', () => {
	// The Turkish dotted and dotless I are the only characters where a locale changes the answer
	// for ASCII-ish input, so every other locale must agree with en-US.
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

	const optionSets = [
		{},
		{pascalCase: true},
		{preserveConsecutiveUppercase: true},
	];

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
	// The array form is the string form with the words already split, so it has to land in the
	// same place for every option combination.
	const optionSets = [
		{},
		{pascalCase: true},
		{preserveConsecutiveUppercase: true},
		{capitalizeAfterNumber: false},
		{pascalCase: true, preserveConsecutiveUppercase: true},
		{preserveConsecutiveUppercase: true, capitalizeAfterNumber: false},
	];

	const mismatches = collectMismatches(20);
	for (const word of ['foo', 'bar', 'FOO', 'BAR', 'IDs', 'a1b', '2c', '中']) {
		for (const options of optionSets) {
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

	// Whitespace-only and empty elements drop out rather than becoming words. If one survived, it
	// would contribute a separator, and that separator is observable: it suppresses the
	// capitalization after a digit run and it pushes the leading `_`/`$` out of the prefix position.
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
