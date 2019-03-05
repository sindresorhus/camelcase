import {expectType} from 'tsd-check';
import camelCase from '.';

expectType<string>(camelCase('foo-bar'));
expectType<string>(camelCase('Foo-Bar', {pascalCase: true}));
expectType<string>(camelCase(['foo', 'bar']));
expectType<string>(camelCase(['__foo__', '--bar'], {pascalCase: true}));
