import test from 'ava';
import camelCase from './index.js';

test('camelCase', t => {
	t.is(camelCase('b2b_registration_request'), 'b2bRegistrationRequest');
	t.is(camelCase('b2b-registration-request'), 'b2bRegistrationRequest');
	t.is(camelCase('b2b_registration_b2b_request'), 'b2bRegistrationB2bRequest');
	t.is(camelCase('foo'), 'foo');
	t.is(camelCase('IDs'), 'ids');
	t.is(camelCase('FooIDs'), 'fooIds');
	t.is(camelCase('foo-bar'), 'fooBar');
	t.is(camelCase('foo-bar-baz'), 'fooBarBaz');
	t.is(camelCase('foo--bar'), 'fooBar');
	t.is(camelCase('--foo-bar'), 'fooBar');
	t.is(camelCase('--foo--bar'), 'fooBar');
	t.is(camelCase('FOO-BAR'), 'fooBar');
	t.is(camelCase('FOÈ-BAR'), 'foèBar');
	t.is(camelCase('-foo-bar-'), 'fooBar');
	t.is(camelCase('--foo--bar--'), 'fooBar');
	t.is(camelCase('foo-1'), 'foo1');
	t.is(camelCase('foo.bar'), 'fooBar');
	t.is(camelCase('foo..bar'), 'fooBar');
	t.is(camelCase('..foo..bar..'), 'fooBar');
	t.is(camelCase('foo_bar'), 'fooBar');
	t.is(camelCase('__foo__bar__'), '__fooBar');
	t.is(camelCase('foo bar'), 'fooBar');
	t.is(camelCase('  foo  bar  '), 'fooBar');
	t.is(camelCase('-'), '');
	t.is(camelCase(' - '), '');
	t.is(camelCase('fooBar'), 'fooBar');
	t.is(camelCase('fooBar-baz'), 'fooBarBaz');
	t.is(camelCase('foìBar-baz'), 'foìBarBaz');
	t.is(camelCase('fooBarBaz-bazzy'), 'fooBarBazBazzy');
	t.is(camelCase('FBBazzy'), 'fbBazzy');
	t.is(camelCase('F'), 'f');
	t.is(camelCase('FooBar'), 'fooBar');
	t.is(camelCase('Foo'), 'foo');
	t.is(camelCase('FOO'), 'foo');
	t.is(camelCase(['foo', 'bar']), 'fooBar');
	t.is(camelCase(['foo', '-bar']), 'fooBar');
	t.is(camelCase(['foo', '-bar', 'baz']), 'fooBarBaz');
	t.is(camelCase(['', '']), '');
	t.is(camelCase('--'), '');
	t.is(camelCase(''), '');
	t.is(camelCase('_'), '_');
	t.is(camelCase(' '), '');
	t.is(camelCase('.'), '');
	t.is(camelCase('..'), '');
	t.is(camelCase('--'), '');
	t.is(camelCase('  '), '');
	t.is(camelCase('__'), '__');
	t.is(camelCase('--__--_--_'), '');
	t.is(camelCase(['---_', '--', '', '-_- ']), '');
	t.is(camelCase('foo bar?'), 'fooBar?');
	t.is(camelCase('foo bar!'), 'fooBar!');
	t.is(camelCase('foo bar$'), 'fooBar$');
	t.is(camelCase('foo-bar#'), 'fooBar#');
	t.is(camelCase('XMLHttpRequest'), 'xmlHttpRequest');
	t.is(camelCase('AjaxXMLHttpRequest'), 'ajaxXmlHttpRequest');
	t.is(camelCase('Ajax-XMLHttpRequest'), 'ajaxXmlHttpRequest');
	t.is(camelCase([]), '');
	t.is(camelCase('mGridCol6@md'), 'mGridCol6@md');
	t.is(camelCase('A::a'), 'a::a');
	t.is(camelCase('Hello1World'), 'hello1World');
	t.is(camelCase('Hello11World'), 'hello11World');
	t.is(camelCase('hello1world'), 'hello1World');
	t.is(camelCase('Hello1World11foo'), 'hello1World11Foo');
	t.is(camelCase('Hello1'), 'hello1');
	t.is(camelCase('hello1'), 'hello1');
	t.is(camelCase('1Hello'), '1Hello');
	t.is(camelCase('1hello'), '1Hello');
	t.is(camelCase('h2w'), 'h2W');
	t.is(camelCase('розовый_пушистый-единороги'), 'розовыйПушистыйЕдинороги');
	t.is(camelCase('розовый_пушистый-единороги'), 'розовыйПушистыйЕдинороги');
	t.is(camelCase('РОЗОВЫЙ_ПУШИСТЫЙ-ЕДИНОРОГИ'), 'розовыйПушистыйЕдинороги');
	t.is(camelCase('桑德在这里。'), '桑德在这里。');
	t.is(camelCase('桑德在这里。'), '桑德在这里。');
	t.is(camelCase('桑德_在这里。'), '桑德在这里。');
});

test('camelCase with pascalCase option', t => {
	t.is(camelCase('b2b_registration_request', {pascalCase: true}), 'B2bRegistrationRequest');
	t.is(camelCase('foo', {pascalCase: true}), 'Foo');
	t.is(camelCase('foo-bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('foo-bar-baz', {pascalCase: true}), 'FooBarBaz');
	t.is(camelCase('foo--bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('--foo-bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('--foo--bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('FOO-BAR', {pascalCase: true}), 'FooBar');
	t.is(camelCase('FOÈ-BAR', {pascalCase: true}), 'FoèBar');
	t.is(camelCase('-foo-bar-', {pascalCase: true}), 'FooBar');
	t.is(camelCase('--foo--bar--', {pascalCase: true}), 'FooBar');
	t.is(camelCase('foo-1', {pascalCase: true}), 'Foo1');
	t.is(camelCase('foo.bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('foo..bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('..foo..bar..', {pascalCase: true}), 'FooBar');
	t.is(camelCase('foo_bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('__foo__bar__', {pascalCase: true}), '__FooBar');
	t.is(camelCase('foo bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('  foo  bar  ', {pascalCase: true}), 'FooBar');
	t.is(camelCase('-', {pascalCase: true}), '');
	t.is(camelCase(' - ', {pascalCase: true}), '');
	t.is(camelCase('fooBar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('fooBar-baz', {pascalCase: true}), 'FooBarBaz');
	t.is(camelCase('foìBar-baz', {pascalCase: true}), 'FoìBarBaz');
	t.is(camelCase('fooBarBaz-bazzy', {pascalCase: true}), 'FooBarBazBazzy');
	t.is(camelCase('FBBazzy', {pascalCase: true}), 'FbBazzy');
	t.is(camelCase('F', {pascalCase: true}), 'F');
	t.is(camelCase('FooBar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('Foo', {pascalCase: true}), 'Foo');
	t.is(camelCase('FOO', {pascalCase: true}), 'Foo');
	t.is(camelCase(['foo', 'bar'], {pascalCase: true}), 'FooBar');
	t.is(camelCase(['foo', '-bar'], {pascalCase: true}), 'FooBar');
	t.is(camelCase(['foo', '-bar', 'baz'], {pascalCase: true}), 'FooBarBaz');
	t.is(camelCase(['', ''], {pascalCase: true}), '');
	t.is(camelCase('--', {pascalCase: true}), '');
	t.is(camelCase('', {pascalCase: true}), '');
	t.is(camelCase('--__--_--_', {pascalCase: true}), '');
	t.is(camelCase(['---_', '--', '', '-_- '], {pascalCase: true}), '');
	t.is(camelCase('foo bar?', {pascalCase: true}), 'FooBar?');
	t.is(camelCase('foo bar!', {pascalCase: true}), 'FooBar!');
	t.is(camelCase('foo bar$', {pascalCase: true}), 'FooBar$');
	t.is(camelCase('foo-bar#', {pascalCase: true}), 'FooBar#');
	t.is(camelCase('XMLHttpRequest', {pascalCase: true}), 'XmlHttpRequest');
	t.is(camelCase('AjaxXMLHttpRequest', {pascalCase: true}), 'AjaxXmlHttpRequest');
	t.is(camelCase('Ajax-XMLHttpRequest', {pascalCase: true}), 'AjaxXmlHttpRequest');
	t.is(camelCase([], {pascalCase: true}), '');
	t.is(camelCase('mGridCol6@md', {pascalCase: true}), 'MGridCol6@md');
	t.is(camelCase('A::a', {pascalCase: true}), 'A::a');
	t.is(camelCase('Hello1World', {pascalCase: true}), 'Hello1World');
	t.is(camelCase('Hello11World', {pascalCase: true}), 'Hello11World');
	t.is(camelCase('hello1world', {pascalCase: true}), 'Hello1World');
	t.is(camelCase('hello1World', {pascalCase: true}), 'Hello1World');
	t.is(camelCase('hello1', {pascalCase: true}), 'Hello1');
	t.is(camelCase('Hello1', {pascalCase: true}), 'Hello1');
	t.is(camelCase('1hello', {pascalCase: true}), '1Hello');
	t.is(camelCase('1Hello', {pascalCase: true}), '1Hello');
	t.is(camelCase('h1W', {pascalCase: true}), 'H1W');
	t.is(camelCase('РозовыйПушистыйЕдинороги', {pascalCase: true}), 'РозовыйПушистыйЕдинороги');
	t.is(camelCase('розовый_пушистый-единороги', {pascalCase: true}), 'РозовыйПушистыйЕдинороги');
	t.is(camelCase('РОЗОВЫЙ_ПУШИСТЫЙ-ЕДИНОРОГИ', {pascalCase: true}), 'РозовыйПушистыйЕдинороги');
	t.is(camelCase('桑德在这里。', {pascalCase: true}), '桑德在这里。');
	t.is(camelCase('桑德_在这里。', {pascalCase: true}), '桑德在这里。');
	t.is(camelCase('a1b', {pascalCase: true}), 'A1B');
});

test('camelCase with preserveConsecutiveUppercase option', t => {
	t.is(camelCase('foo-BAR', {preserveConsecutiveUppercase: true}), 'fooBAR');
	t.is(camelCase('Foo-BAR', {preserveConsecutiveUppercase: true}), 'fooBAR');
	t.is(camelCase('fooBAR', {preserveConsecutiveUppercase: true}), 'fooBAR');
	t.is(camelCase('fooBaR', {preserveConsecutiveUppercase: true}), 'fooBaR');
	t.is(camelCase('FOÈ-BAR', {preserveConsecutiveUppercase: true}), 'FOÈBAR');
	t.is(camelCase(['foo', 'BAR'], {preserveConsecutiveUppercase: true}), 'fooBAR');
	t.is(camelCase(['foo', '-BAR'], {preserveConsecutiveUppercase: true}), 'fooBAR');
	t.is(camelCase(['foo', '-BAR', 'baz'], {preserveConsecutiveUppercase: true}), 'fooBARBaz');
	t.is(camelCase(['', ''], {preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('--', {preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('', {preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('--__--_--_', {preserveConsecutiveUppercase: true}), '');
	t.is(camelCase(['---_', '--', '', '-_- '], {preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('foo BAR?', {preserveConsecutiveUppercase: true}), 'fooBAR?');
	t.is(camelCase('foo BAR!', {preserveConsecutiveUppercase: true}), 'fooBAR!');
	t.is(camelCase('foo BAR$', {preserveConsecutiveUppercase: true}), 'fooBAR$');
	t.is(camelCase('foo-BAR#', {preserveConsecutiveUppercase: true}), 'fooBAR#');
	t.is(camelCase('XMLHttpRequest', {preserveConsecutiveUppercase: true}), 'XMLHttpRequest');
	t.is(camelCase('AjaxXMLHttpRequest', {preserveConsecutiveUppercase: true}), 'ajaxXMLHttpRequest');
	t.is(camelCase('Ajax-XMLHttpRequest', {preserveConsecutiveUppercase: true}), 'ajaxXMLHttpRequest');
	t.is(camelCase([], {preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('mGridCOl6@md', {preserveConsecutiveUppercase: true}), 'mGridCOl6@md');
	t.is(camelCase('A::a', {preserveConsecutiveUppercase: true}), 'a::a');
	t.is(camelCase('Hello1WORLD', {preserveConsecutiveUppercase: true}), 'hello1WORLD');
	t.is(camelCase('Hello11WORLD', {preserveConsecutiveUppercase: true}), 'hello11WORLD');
	t.is(camelCase('РозовыйПушистыйFOOдинорогиf', {preserveConsecutiveUppercase: true}), 'розовыйПушистыйFOOдинорогиf');
	t.is(camelCase('桑德在这里。', {preserveConsecutiveUppercase: true}), '桑德在这里。');
	t.is(camelCase('桑德_在这里。', {preserveConsecutiveUppercase: true}), '桑德在这里。');
	t.is(camelCase('IDs', {preserveConsecutiveUppercase: true}), 'iDs');
	t.is(camelCase('FooIDs', {preserveConsecutiveUppercase: true}), 'fooIDs');
});

test('camelCase with both pascalCase and preserveConsecutiveUppercase option', t => {
	t.is(camelCase('foo-BAR', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR');
	t.is(camelCase('fooBAR', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR');
	t.is(camelCase('fooBaR', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBaR');
	t.is(camelCase('fOÈ-BAR', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FOÈBAR');
	t.is(camelCase('--foo.BAR', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR');
	t.is(camelCase(['Foo', 'BAR'], {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR');
	t.is(camelCase(['foo', '-BAR'], {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR');
	t.is(camelCase(['foo', '-BAR', 'baz'], {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBARBaz');
	t.is(camelCase(['', ''], {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('--', {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('', {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('--__--_--_', {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	t.is(camelCase(['---_', '--', '', '-_- '], {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('foo BAR?', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR?');
	t.is(camelCase('foo BAR!', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR!');
	t.is(camelCase('Foo BAR$', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR$');
	t.is(camelCase('foo-BAR#', {pascalCase: true, preserveConsecutiveUppercase: true}), 'FooBAR#');
	t.is(camelCase('xMLHttpRequest', {pascalCase: true, preserveConsecutiveUppercase: true}), 'XMLHttpRequest');
	t.is(camelCase('ajaxXMLHttpRequest', {pascalCase: true, preserveConsecutiveUppercase: true}), 'AjaxXMLHttpRequest');
	t.is(camelCase('Ajax-XMLHttpRequest', {pascalCase: true, preserveConsecutiveUppercase: true}), 'AjaxXMLHttpRequest');
	t.is(camelCase([], {pascalCase: true, preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('mGridCOl6@md', {pascalCase: true, preserveConsecutiveUppercase: true}), 'MGridCOl6@md');
	t.is(camelCase('A::a', {pascalCase: true, preserveConsecutiveUppercase: true}), 'A::a');
	t.is(camelCase('Hello1WORLD', {pascalCase: true, preserveConsecutiveUppercase: true}), 'Hello1WORLD');
	t.is(camelCase('Hello11WORLD', {pascalCase: true, preserveConsecutiveUppercase: true}), 'Hello11WORLD');
	t.is(camelCase('pозовыйПушистыйFOOдинорогиf', {pascalCase: true, preserveConsecutiveUppercase: true}), 'PозовыйПушистыйFOOдинорогиf');
	t.is(camelCase('桑德在这里。', {pascalCase: true, preserveConsecutiveUppercase: true}), '桑德在这里。');
	t.is(camelCase('桑德_在这里。', {pascalCase: true, preserveConsecutiveUppercase: true}), '桑德在这里。');
});

test('camelCase with locale option', t => {
	t.is(camelCase('lorem-ipsum', {locale: 'tr-TR'}), 'loremİpsum');
	t.is(camelCase('lorem-ipsum', {locale: 'en-EN'}), 'loremIpsum');
	t.is(camelCase('lorem-ipsum', {locale: ['tr', 'TR', 'tr-TR']}), 'loremİpsum');
	t.is(camelCase('lorem-ipsum', {locale: ['en-EN', 'en-GB']}), 'loremIpsum');
	t.is(camelCase('ipsum-dolor', {pascalCase: true, locale: 'tr-TR'}), 'İpsumDolor');
	t.is(camelCase('ipsum-dolor', {pascalCase: true, locale: 'en-EN'}), 'IpsumDolor');
	t.is(camelCase('ipsum-dolor', {pascalCase: true, locale: ['tr', 'TR', 'tr-TR']}), 'İpsumDolor');
	t.is(camelCase('ipsum-dolor', {pascalCase: true, locale: ['en-EN', 'en-GB']}), 'IpsumDolor');
});

test('camelCase with disabled locale', t => {
	withLocaleCaseFunctionsMocked(() => {
		t.is(camelCase('lorem-ipsum', {locale: false}), 'loremIpsum');
		t.is(camelCase('ipsum-dolor', {pascalCase: true, locale: false}), 'IpsumDolor');
		t.is(camelCase('ipsum-DOLOR', {pascalCase: true, locale: false, preserveConsecutiveUppercase: true}), 'IpsumDOLOR');
	});
});

test('number handling follows Google Style Guide', t => {
	// Numbers don't create word boundaries (Google Java Style Guide)
	// https://google.github.io/styleguide/javaguide.html#s5.3-camel-case
	t.is(camelCase('turn_on_2sv', {capitalizeAfterNumber: false}), 'turnOn2sv'); // NOT turnOn2Sv
	t.is(camelCase('a1b_text', {capitalizeAfterNumber: false}), 'a1bText'); // NOT a1BText
	t.is(camelCase('foo2bar', {capitalizeAfterNumber: false}), 'foo2bar'); // NOT foo2Bar
	t.is(camelCase('version2', {capitalizeAfterNumber: false}), 'version2');

	// With pascalCase
	t.is(camelCase('turn_on_2sv', {pascalCase: true, capitalizeAfterNumber: false}), 'TurnOn2sv');
	t.is(camelCase('a1b_text', {pascalCase: true, capitalizeAfterNumber: false}), 'A1bText');
});

test('camelCase with capitalizeAfterNumber option', t => {
	t.is(camelCase('Hello1World'), 'hello1World');
	t.is(camelCase('Hello1World', {capitalizeAfterNumber: false}), 'hello1World'); // Preserves uppercase W
	t.is(camelCase('foo2bar'), 'foo2Bar');
	t.is(camelCase('foo2bar', {capitalizeAfterNumber: false}), 'foo2bar');
	t.is(camelCase('hello1world'), 'hello1World');
	t.is(camelCase('hello1world', {capitalizeAfterNumber: false}), 'hello1world'); // Preserves lowercase w
	t.is(camelCase('turn_on_2sv'), 'turnOn2Sv');
	t.is(camelCase('turn_on_2sv', {capitalizeAfterNumber: false}), 'turnOn2sv');

	t.is(camelCase('Hello1World', {pascalCase: true}), 'Hello1World');
	t.is(camelCase('Hello1World', {pascalCase: true, capitalizeAfterNumber: false}), 'Hello1World'); // Preserves uppercase W
	t.is(camelCase('turn_on_2sv', {pascalCase: true}), 'TurnOn2Sv');
	t.is(camelCase('turn_on_2sv', {pascalCase: true, capitalizeAfterNumber: false}), 'TurnOn2sv');
});

test('capitalizeAfterNumber edge cases', t => {
	t.is(camelCase('foo-2bar'), 'foo2Bar');
	t.is(camelCase('foo-2bar', {capitalizeAfterNumber: false}), 'foo2bar');
	t.is(camelCase('foo-2bar', {pascalCase: true}), 'Foo2Bar');
	t.is(camelCase('foo-2bar', {pascalCase: true, capitalizeAfterNumber: false}), 'Foo2bar');

	t.is(camelCase('2foo-bar'), '2FooBar');
	t.is(camelCase('2foo-bar', {capitalizeAfterNumber: false}), '2fooBar');
	t.is(camelCase('2foo-bar', {pascalCase: true}), '2FooBar');
	t.is(camelCase('2foo-bar', {pascalCase: true, capitalizeAfterNumber: false}), '2fooBar');

	t.is(camelCase('XML2HTTP'), 'xml2Http');
	t.is(camelCase('XML2HTTP', {capitalizeAfterNumber: false}), 'xml2Http'); // Preserves uppercase H
	t.is(camelCase('XML2HTTP', {pascalCase: true}), 'Xml2Http');
	t.is(camelCase('XML2HTTP', {pascalCase: true, capitalizeAfterNumber: false}), 'Xml2Http'); // Preserves uppercase H

	t.is(camelCase('2a'), '2A');
	t.is(camelCase('2a', {capitalizeAfterNumber: false}), '2a');
	t.is(camelCase('2a', {pascalCase: true}), '2A');
	t.is(camelCase('2a', {pascalCase: true, capitalizeAfterNumber: false}), '2a');

	t.is(camelCase('foo2BAR', {preserveConsecutiveUppercase: true}), 'foo2BAR');
	t.is(camelCase('foo2BAR', {preserveConsecutiveUppercase: true, capitalizeAfterNumber: false}), 'foo2BAR');
});

test('case preservation after numbers (capitalizeAfterNumber: false)', t => {
	// When capitalizeAfterNumber is false, original case is preserved
	t.is(camelCase('Textures_3d', {capitalizeAfterNumber: false}), 'textures3d'); // Preserves lowercase d
	t.is(camelCase('Textures_3D', {capitalizeAfterNumber: false}), 'textures3D'); // Preserves uppercase D
	t.is(camelCase('version_1a', {capitalizeAfterNumber: false}), 'version1a');
	t.is(camelCase('version_1A', {capitalizeAfterNumber: false}), 'version1A');
	t.is(camelCase('foo_2_bar', {capitalizeAfterNumber: false}), 'foo2Bar'); // 'bar' is after separator, not directly after number

	// With pascalCase
	t.is(camelCase('Textures_3d', {pascalCase: true, capitalizeAfterNumber: false}), 'Textures3d');
	t.is(camelCase('Textures_3D', {pascalCase: true, capitalizeAfterNumber: false}), 'Textures3D');
});

test('preserve leading underscores and dollar signs', t => {
	// Leading _ and $ have semantic meaning (private/internal, jQuery/observables)
	t.is(camelCase('_foo_bar'), '_fooBar');
	t.is(camelCase('$foo_bar'), '$fooBar');
	t.is(camelCase('__foo_bar'), '__fooBar');
	t.is(camelCase('$$foo_bar'), '$$fooBar');
	t.is(camelCase('$_foo_bar'), '$_fooBar');
	t.is(camelCase('_$foo_bar'), '_$fooBar');

	// Edge cases: only prefix characters
	t.is(camelCase('_'), '_');
	t.is(camelCase('__'), '__');
	t.is(camelCase('$'), '$');
	t.is(camelCase('$$$'), '$$$');
	t.is(camelCase('_$'), '_$');

	// With pascalCase
	t.is(camelCase('_foo_bar', {pascalCase: true}), '_FooBar');
	t.is(camelCase('$foo_bar', {pascalCase: true}), '$FooBar');
	t.is(camelCase('__foo_bar', {pascalCase: true}), '__FooBar');

	// With preserveConsecutiveUppercase
	t.is(camelCase('_foo_BAR', {preserveConsecutiveUppercase: true}), '_fooBAR');
	t.is(camelCase('$foo_BAR', {preserveConsecutiveUppercase: true}), '$fooBAR');

	// Combined with other transformations
	t.is(camelCase('_foo-bar_baz'), '_fooBarBaz');
	t.is(camelCase('$http_service'), '$httpService');
});

test('invalid input', t => {
	t.throws(() => {
		camelCase(1);
	}, {
		message: /Expected the input to be/,
	});
});

/* eslint-disable no-extend-native */
const withLocaleCaseFunctionsMocked = fn => {
	const throwWhenBeingCalled = () => {
		throw new Error('Should not be called');
	};

	const toLocaleUpperCase = Object.getOwnPropertyDescriptor(String.prototype, 'toLocaleUpperCase');
	const toLocaleLowerCase = Object.getOwnPropertyDescriptor(String.prototype, 'toLocaleLowerCase');

	Object.defineProperty(String.prototype, 'toLocaleUpperCase', {
		...toLocaleUpperCase,
		value: throwWhenBeingCalled,
	});
	Object.defineProperty(String.prototype, 'toLocaleLowerCase', {
		...toLocaleLowerCase,
		value: throwWhenBeingCalled,
	});

	try {
		fn();
	} finally {
		Object.defineProperty(String.prototype, 'toLocaleUpperCase', toLocaleUpperCase);
		Object.defineProperty(String.prototype, 'toLocaleLowerCase', toLocaleLowerCase);
	}
};
/* eslint-enable no-extend-native */
