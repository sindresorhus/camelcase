declare namespace camelcase {
	interface Options {
		/**
		Uppercase the first character: `foo-bar` → `FooBar`.

		@default false
		*/
		readonly pascalCase?: boolean;

		/**
		From `String.prototype.toLocaleUpperCase()`: The locale parameter indicates the locale to be used to convert to upper/lower case according to any locale-specific case mappings. If multiple locales are given in an Array, the best available locale is used. The default locale is the host environment’s current locale.

		@default The host environment’s current locale
		*/
		readonly locale?: string | readonly string[];
	}
}

/**
Convert a dash/dot/underscore/space separated string to camelCase or PascalCase: `foo-bar` → `fooBar`.

Correctly handles Unicode strings.

@param input - String to convert to camel case.

@example
```
import camelCase = require('camelcase');

camelCase('foo-bar');
//=> 'fooBar'

camelCase('foo_bar');
//=> 'fooBar'

camelCase('Foo-Bar');
//=> 'fooBar'

camelCase('розовый_пушистый_единороги');
//=> 'розовыйПушистыйЕдинороги'

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

camelCase('lorem-ipsum', {locale: 'en-US'});
//=> 'loremIpsum'
```
*/
declare function camelcase(
	input: string | readonly string[],
	options?: camelcase.Options
): string;

export = camelcase;
