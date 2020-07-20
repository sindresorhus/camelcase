declare namespace camelcase {
	interface Options {
		/**
		Uppercase the first character: `foo-bar` → `FooBar`.

		@default false
		*/
		readonly pascalCase?: boolean;

		/**
		Convert characters with given locale(s). See String.prototype.toLocaleLowerCase().

		@default undefined. Uses host's current locale when not provided.
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
