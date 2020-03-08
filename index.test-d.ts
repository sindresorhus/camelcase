import {expectType} from 'tsd';
import camelCase = require('.');

expectType<string>(camelCase('foo-bar'));
expectType<string>(camelCase('розовый_пушистый_единороги'));
expectType<string>(camelCase('Foo-Bar', {pascalCase: true}));
expectType<string>(camelCase(['foo', 'bar']));
expectType<string>(camelCase(['__foo__', '--bar'], {pascalCase: true}));
expectType<string>(camelCase(['__foo__', '--bar'], {saveCapital: true}));
