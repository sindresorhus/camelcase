import {expectError, expectType} from 'tsd';
import camelCase, {type Options} from './index.js';

expectType<string>(camelCase('foo-bar'));
expectType<string>(camelCase('розовый_пушистый_единороги'));
expectType<string>(camelCase('Foo-Bar', {locale: ['tr']}));
expectType<string>(camelCase('Foo-Bar', {locale: ['tr', 'TR', 'tr-TR']}));
expectType<string>(camelCase('Foo-Bar', {locale: 'tr-TR'}));
expectType<string>(camelCase('Foo-Bar', {locale: false}));
expectType<string>(camelCase('Foo-Bar', {pascalCase: true, locale: ['tr']}));
expectType<string>(camelCase('Foo-Bar', {pascalCase: true, locale: ['tr', 'TR', 'tr-TR']}));
expectType<string>(camelCase('Foo-Bar', {pascalCase: true}));
expectType<string>(camelCase('foo2bar', {capitalizeAfterNumber: true}));
expectType<string>(camelCase('foo2bar', {capitalizeAfterNumber: false}));
expectType<string>(camelCase('foo2bar', {pascalCase: true, capitalizeAfterNumber: true}));
expectType<string>(camelCase('foo2bar', {pascalCase: true, capitalizeAfterNumber: false}));
expectType<string>(camelCase(['foo', 'bar']));
expectType<string>(camelCase(['__foo__', '--bar'], {pascalCase: true}));

// A `readonly` array is accepted, which is what the declaration promises.
const readonlyWords = ['foo', 'bar'] as const;
expectType<string>(camelCase(readonlyWords));
expectType<string>(camelCase(readonlyWords, {pascalCase: true}));

expectType<string>(camelCase('foo-BAR', {preserveConsecutiveUppercase: true}));
expectType<string>(camelCase('foo-BAR', {preserveConsecutiveUppercase: false}));
expectType<string>(camelCase('foo-BAR', {pascalCase: true, preserveConsecutiveUppercase: true}));
expectType<string>(camelCase('foo-BAR', {preserveConsecutiveUppercase: true, capitalizeAfterNumber: false}));
expectType<string>(camelCase('foo-BAR', {
	pascalCase: true,
	preserveConsecutiveUppercase: true,
	capitalizeAfterNumber: false,
	locale: 'en-US',
}));

const options: Options = {
	pascalCase: true,
	preserveConsecutiveUppercase: false,
	capitalizeAfterNumber: true,
	locale: false,
};
expectType<Options>(options);
expectType<string>(camelCase('foo-BAR', options));

expectError(camelCase(1));
expectError(camelCase(null));
expectError(camelCase(undefined));
expectError(camelCase({}));
expectError(camelCase(['foo', 1]));
expectError(camelCase('foo-bar', {pascalCase: 'yes'}));
expectError(camelCase('foo-bar', {unknownOption: true}));
expectError(camelCase('foo-bar', {locale: 42}));
