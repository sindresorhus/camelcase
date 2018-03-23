# camelcase [![Build Status](https://travis-ci.org/sindresorhus/camelcase.svg?branch=master)](https://travis-ci.org/sindresorhus/camelcase)

> Convert a dash/dot/underscore/space separated string to camelCase: `foo-bar` → `fooBar`


## Install

```
$ npm install --save camelcase
```


## Usage

```js
const camelCase = require('camelcase');

camelCase('foo-bar');
//=> 'fooBar'

camelCase('foo_bar');
//=> 'fooBar'

camelCase('Foo-Bar');
//=> 'fooBar'

camelCase('Foo-Bar', {pascalCase: true});
//=> 'FooBar'

camelCase('--foo.bar', {pascalCase: false});
//=> 'fooBar'

camelCase('foo bar');
//=> 'fooBar'

console.log(process.argv[3]);
//=> '--foo-bar'
camelCase(process.argv[3]);
//=> 'fooBar'

camelCase(['foo', 'bar']);
//=> 'fooBar'

camelCase(['__foo__', '--bar'], {pascalCase: true});
//=> 'FooBar'
```


## API

### camelCase(input, [option])

#### input

Type: `string` `array`

String/strings to convert to camelCase


#### option

**pascalCase**

Type: `boolean`

Default: `false`

This argument is optional. The aim is to enable PascalCase: `foo-bar` → `FooBar`. If not considered, the default value is `false` and it will convert as camelCase: `foo-bar` → `fooBar`. 


## Related

- [decamelize](https://github.com/sindresorhus/decamelize) - The inverse of this module
- [uppercamelcase](https://github.com/SamVerschueren/uppercamelcase) - Like this module, but to PascalCase instead of camelCase


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
