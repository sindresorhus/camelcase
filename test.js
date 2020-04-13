import test from 'ava';
import camelCase from '.';

test('camelCase', t => {
	t.is(camelCase('foo'), 'foo');
	t.is(camelCase('foo-bar'), 'fooBar');
	t.is(camelCase('foo-bar-baz'), 'fooBarBaz');
	t.is(camelCase('foo--bar'), 'fooBar');
	t.is(camelCase('--foo-bar'), 'fooBar');
	t.is(camelCase('--foo--bar'), 'fooBar');
	t.is(camelCase('FOO-BAR'), 'fooBar');
	t.is(camelCase('FOÈ-BAR'), 'foèBar');
	t.is(camelCase('-foo-bar-'), 'fooBar');
	t.is(camelCase('--foo--bar--'), 'fooBar');
	t.is(camelCase('foo.bar'), 'fooBar');
	t.is(camelCase('foo..bar'), 'fooBar');
	t.is(camelCase('..foo..bar..'), 'fooBar');
	t.is(camelCase('foo_bar'), 'fooBar');
	t.is(camelCase('__foo__bar__'), 'fooBar');
	t.is(camelCase('__foo__bar__'), 'fooBar');
	t.is(camelCase('foo bar'), 'fooBar');
	t.is(camelCase('  foo  bar  '), 'fooBar');
	t.is(camelCase('-'), '-');
	t.is(camelCase(' - '), '-');
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
	t.is(camelCase('label-name-SC'), 'LabelNameSc');
});

test('camelCase with pascalCase option', t => {
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
	t.is(camelCase('foo.bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('foo..bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('..foo..bar..', {pascalCase: true}), 'FooBar');
	t.is(camelCase('foo_bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('__foo__bar__', {pascalCase: true}), 'FooBar');
	t.is(camelCase('__foo__bar__', {pascalCase: true}), 'FooBar');
	t.is(camelCase('foo bar', {pascalCase: true}), 'FooBar');
	t.is(camelCase('  foo  bar  ', {pascalCase: true}), 'FooBar');
	t.is(camelCase('-', {pascalCase: true}), '-');
	t.is(camelCase(' - ', {pascalCase: true}), '-');
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
	t.is(camelCase('label-name-SC', {pascalCase: true}), 'LabelNameSc');
});

test('camelCase with preserveConsecutiveUppercase option', t => {
	t.is(camelCase('foo', {preserveConsecutiveUppercase: true}), 'foo');
	t.is(camelCase('foo-bar', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('foo-bar-baz', {preserveConsecutiveUppercase: true}), 'fooBarBaz');
	t.is(camelCase('foo--bar', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('--foo-bar', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('--foo--bar', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('FOO-BAR', {preserveConsecutiveUppercase: true}), 'FOOBAR');
	t.is(camelCase('FOÈ-BAR', {preserveConsecutiveUppercase: true}), 'FOÈBAR');
	t.is(camelCase('-foo-bar-', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('--foo--bar--', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('foo.bar', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('foo..bar', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('..foo..bar..', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('foo_bar', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('__foo__bar__', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('__foo__bar__', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('foo bar', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('  foo  bar  ', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('-', {preserveConsecutiveUppercase: true}), '-');
	t.is(camelCase(' - ', {preserveConsecutiveUppercase: true}), '-');
	t.is(camelCase('fooBar', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('fooBar-baz', {preserveConsecutiveUppercase: true}), 'fooBarBaz');
	t.is(camelCase('foìBar-baz', {preserveConsecutiveUppercase: true}), 'foìBarBaz');
	t.is(camelCase('fooBarBaz-bazzy', {preserveConsecutiveUppercase: true}), 'fooBarBazBazzy');
	t.is(camelCase('FBBazzy', {preserveConsecutiveUppercase: true}), 'FBBazzy');
	t.is(camelCase('F', {preserveConsecutiveUppercase: true}), 'f');
	t.is(camelCase('FooBar', {preserveConsecutiveUppercase: true}), 'fooBar');
	t.is(camelCase('Foo', {preserveConsecutiveUppercase: true}), 'foo');
	t.is(camelCase('FOO', {preserveConsecutiveUppercase: true}), 'FOO');
	t.is(camelCase(['foo', 'bar']), 'fooBar');
	t.is(camelCase(['foo', '-bar']), 'fooBar');
	t.is(camelCase(['foo', '-bar', 'baz']), 'fooBarBaz');
	t.is(camelCase(['', '']), '');
	t.is(camelCase('--', {preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('', {preserveConsecutiveUppercase: true}), '');
	t.is(camelCase('--__--_--_', {preserveConsecutiveUppercase: true}), '');
	t.is(camelCase(['---_', '--', '', '-_- ']), '');
	t.is(camelCase('foo bar?', {preserveConsecutiveUppercase: true}), 'fooBar?');
	t.is(camelCase('foo bar!', {preserveConsecutiveUppercase: true}), 'fooBar!');
	t.is(camelCase('foo bar$', {preserveConsecutiveUppercase: true}), 'fooBar$');
	t.is(camelCase('foo-bar#', {preserveConsecutiveUppercase: true}), 'fooBar#');
	t.is(camelCase('XMLHttpRequest', {preserveConsecutiveUppercase: true}), 'XMLHttpRequest');
	t.is(camelCase('AjaxXMLHttpRequest', {preserveConsecutiveUppercase: true}), 'ajaxXMLHttpRequest');
	t.is(camelCase('Ajax-XMLHttpRequest', {preserveConsecutiveUppercase: true}), 'ajaxXMLHttpRequest');
	t.is(camelCase([]), '');
	t.is(camelCase('mGridCol6@md', {preserveConsecutiveUppercase: true}), 'mGridCol6@md');
	t.is(camelCase('A::a', {preserveConsecutiveUppercase: true}), 'a::a');
	t.is(camelCase('Hello1World', {preserveConsecutiveUppercase: true}), 'hello1World');
	t.is(camelCase('Hello11World', {preserveConsecutiveUppercase: true}), 'hello11World');
	t.is(camelCase('hello1world', {preserveConsecutiveUppercase: true}), 'hello1World');
	t.is(camelCase('Hello1World11foo', {preserveConsecutiveUppercase: true}), 'hello1World11Foo');
	t.is(camelCase('Hello1', {preserveConsecutiveUppercase: true}), 'hello1');
	t.is(camelCase('hello1', {preserveConsecutiveUppercase: true}), 'hello1');
	t.is(camelCase('1Hello', {preserveConsecutiveUppercase: true}), '1Hello');
	t.is(camelCase('1hello', {preserveConsecutiveUppercase: true}), '1Hello');
	t.is(camelCase('h2w', {preserveConsecutiveUppercase: true}), 'h2W');
	t.is(camelCase('label-name-SC', {preserveConsecutiveUppercase: true}), 'labelNameSC');
});

test('camelCase with pascalCase+preserveConsecutiveUppercase option', t => {
	t.is(camelCase('Hello1', {preserveConsecutiveUppercase: true, pascalCase: true}), 'Hello1');
	t.is(camelCase('FOO', {preserveConsecutiveUppercase: true, pascalCase: true}), 'FOO');
	t.is(camelCase('label-name-SC', {preserveConsecutiveUppercase: true, pascalCase: true}), 'LabelNameSC');
	t.is(camelCase('Ajax-XMLHttpRequest', {preserveConsecutiveUppercase: true, pascalCase: true}), 'AjaxXMLHttpRequest');
	t.is(camelCase('Foo_BAR', {preserveConsecutiveUppercase: true, pascalCase: true}), 'FooBAR');
});

test('invalid input', t => {
	t.throws(() => {
		camelCase(1);
	}, /Expected the input to be/);
});
