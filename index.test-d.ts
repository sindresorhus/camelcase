import {expectTypeOf, expectError} from 'nz';
import camelCase, {type Options} from './index.js';

expectTypeOf(camelCase('foo-bar')).toBe<string>();
expectTypeOf(camelCase('розовый_пушистый_единороги')).toBe<string>();
expectTypeOf(camelCase('Foo-Bar', {locale: ['tr']})).toBe<string>();
expectTypeOf(camelCase('Foo-Bar', {locale: ['tr', 'TR', 'tr-TR']})).toBe<string>();
expectTypeOf(camelCase('Foo-Bar', {locale: 'tr-TR'})).toBe<string>();
expectTypeOf(camelCase('Foo-Bar', {locale: false})).toBe<string>();
expectTypeOf(camelCase('Foo-Bar', {pascalCase: true, locale: ['tr']})).toBe<string>();
expectTypeOf(camelCase('Foo-Bar', {pascalCase: true, locale: ['tr', 'TR', 'tr-TR']})).toBe<string>();
expectTypeOf(camelCase('Foo-Bar', {pascalCase: true})).toBe<string>();
expectTypeOf(camelCase('foo2bar', {capitalizeAfterNumber: true})).toBe<string>();
expectTypeOf(camelCase('foo2bar', {capitalizeAfterNumber: false})).toBe<string>();
expectTypeOf(camelCase('foo2bar', {pascalCase: true, capitalizeAfterNumber: true})).toBe<string>();
expectTypeOf(camelCase('foo2bar', {pascalCase: true, capitalizeAfterNumber: false})).toBe<string>();
expectTypeOf(camelCase(['foo', 'bar'])).toBe<string>();
expectTypeOf(camelCase(['__foo__', '--bar'], {pascalCase: true})).toBe<string>();

// A `readonly` array is accepted, which is what the declaration promises.
const readonlyWords = ['foo', 'bar'] as const;
expectTypeOf(camelCase(readonlyWords)).toBe<string>();
expectTypeOf(camelCase(readonlyWords, {pascalCase: true})).toBe<string>();

expectTypeOf(camelCase('foo-BAR', {preserveConsecutiveUppercase: true})).toBe<string>();
expectTypeOf(camelCase('foo-BAR', {preserveConsecutiveUppercase: false})).toBe<string>();
expectTypeOf(camelCase('foo-BAR', {pascalCase: true, preserveConsecutiveUppercase: true})).toBe<string>();
expectTypeOf(camelCase('foo-BAR', {preserveConsecutiveUppercase: true, capitalizeAfterNumber: false})).toBe<string>();
expectTypeOf(camelCase('foo-BAR', {
	pascalCase: true,
	preserveConsecutiveUppercase: true,
	capitalizeAfterNumber: false,
	locale: 'en-US',
})).toBe<string>();

const options: Options = {
	pascalCase: true,
	preserveConsecutiveUppercase: false,
	capitalizeAfterNumber: true,
	locale: false,
};
expectTypeOf(options).toBe<Options>();
expectTypeOf(camelCase('foo-BAR', options)).toBe<string>();

expectError(camelCase(1));
expectError(camelCase(null));
expectError(camelCase(undefined));
expectError(camelCase({}));
expectError(camelCase(['foo', 1]));
expectError(camelCase('foo-bar', {pascalCase: 'yes'}));
expectError(camelCase('foo-bar', {unknownOption: true}));
expectError(camelCase('foo-bar', {locale: 42}));
