'use strict';
var test = require('ava');
var camelCase = require('./');

test(function (t) {
	t.assert(camelCase('foo') === 'foo');
	t.assert(camelCase('foo-bar') === 'fooBar');
	t.assert(camelCase('foo-bar-baz') === 'fooBarBaz');
	t.assert(camelCase('foo--bar') === 'fooBar');
	t.assert(camelCase('--foo-bar') === 'fooBar');
	t.assert(camelCase('--foo--bar') === 'fooBar');
	t.assert(camelCase('FOO-BAR') === 'fooBar');
	t.assert(camelCase('-foo-bar-') === 'fooBar');
	t.assert(camelCase('--foo--bar--') === 'fooBar');
	t.assert(camelCase('foo.bar') === 'fooBar');
	t.assert(camelCase('foo..bar') === 'fooBar');
	t.assert(camelCase('..foo..bar..') === 'fooBar');
	t.assert(camelCase('foo_bar') === 'fooBar');
	t.assert(camelCase('__foo__bar__') === 'fooBar');
	t.assert(camelCase('__foo__bar__') === 'fooBar');
	t.assert(camelCase('foo bar') === 'fooBar');
	t.assert(camelCase('  foo  bar  ') === 'fooBar');
	t.assert(camelCase('-') === '-');
	t.assert(camelCase(' - ') === '-');
});
