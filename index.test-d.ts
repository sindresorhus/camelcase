import {expectType} from 'tsd';
import camelCase from './index.js';

expectType<string>(camelCase('foo-bar'));
expectType<string>(camelCase('розовый_пушистый_единороги'));
expectType<string>(camelCase('Foo-Bar', {locale: ['tr']}));
expectType<string>(camelCase('Foo-Bar', {locale: ['tr', 'TR', 'tr-TR']}));
expectType<string>(camelCase('Foo-Bar', {pascalCase: true, locale: ['tr']}));
expectType<string>(camelCase('Foo-Bar', {pascalCase: true, locale: ['tr', 'TR', 'tr-TR']}));
expectType<string>(camelCase('Foo-Bar', {pascalCase: true}));
expectType<string>(camelCase('foo2bar', {capitalizeAfterNumber: true}));
expectType<string>(camelCase('foo2bar', {capitalizeAfterNumber: false}));
expectType<string>(camelCase('foo2bar', {pascalCase: true, capitalizeAfterNumber: true}));
expectType<string>(camelCase('foo2bar', {pascalCase: true, capitalizeAfterNumber: false}));
expectType<string>(camelCase(['foo', 'bar']));
expectType<string>(camelCase(['__foo__', '--bar'], {pascalCase: true}));
