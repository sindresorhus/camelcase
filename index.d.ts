declare namespace camelcase {
	interface Options {
		/**
		Uppercase the first character: `foo-bar` → `FooBar`.

		@default false
		*/
		readonly pascalCase?: boolean;

		/**
		Preserve consecutive uppercase characters: `foo-BAR` → `fooBAR`

		@default false
		*/
		readonly preserveConsecutiveUppercase?: boolean;
	}
}

/**
Convert a dash/dot/underscore/space separated string to camelCase or PascalCase: `foo-bar` → `fooBar`.

Correctly handles Unicode strings.

@param input - String to convert to camel case.

	camelCase('foo bar');
	//=> 'fooBar'

	camelCase('foo-bar');
	//=> 'fooBar'

camelCase('foo-bar');
//=> 'fooBar'

camelCase('foo_bar');
//=> 'fooBar'

camelCase('Foo-Bar');
//=> 'fooBar'

camelCase('розовый_пушистый_единороги');
//=> 'розовыйПушистыйЕдинороги'

	camelCase('foo-baz-BAR', {preserveConsecutiveUppercase: true});
	//=> 'fooBazBAR'

	camelCase('AjaxXMLHttpRequest', {preserveConsecutiveUppercase: true});
	//=> 'ajaxXMLHttpRequest'

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
*/
declare function camelcase(
	input: string | readonly string[],
	options?: camelcase.Options
): string;

export = camelcase;
