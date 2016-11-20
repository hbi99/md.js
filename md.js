/*!
 *             __
 *   __ _  ___/ /
 *  /  ' \/ _  / 
 * /_/_/_/\_,_/ 
 * 
 * md.js is a lightweight markdown parser
 * https://github.com/thysultan/md.js
 * 
 * @licence MIT
 */
(function (factory) {
	if (typeof exports === 'object' && typeof module !== 'undefined') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory());
	} else {
		window.md = factory();
	}
}(function () {
	var escapeQuotesRegExp = /"/g;

	var XSSFilterRegExp = /<(script)>([^]+?)<\/(script)>/gmi;
	var XSSFilterTemplate = '&lt;$1&gt;$2&lt;/$3&gt;';

	var XSSFilterHrefRegExp = /(<a[^>]*? href[^]*?)(javascript)[\n\t ]*:/gmi;
	var XSSFilterHrefTemplate = '$1#$2&#58;';

	var removeWhiteSpaceRegExp = /^[\t ]+|[\t ]$/gm;

	var htmlFilterRegExp = /(<.*>[\t ]*\n^.*)/gm;
	var htmlFilterTemplate = function (match, group1) { 
		return group1.replace(/(^\n|$\n)/gm, '');
	};

	var cssFilterRegExp = /(<style>[^]*<\/style>)/gm;
	var cssFilterTemplate = htmlFilterTemplate;

	var blockQuotesRegExp = /^.*?> (.*)/gm;
	var blockQuotesTemplate = '<blockquote>$1</blockquote>';

	var inlineCodeRegExp = /`([^`]+?)`/g;
	var inlineCodeTemplate = '<code>$1</code>';

	var blockCodeRegExp = /```(.*)\n([^]+)```(?!```)/gm;

	var imagesRegExp = /!\[(.*)\]\((.*)\)/gm;
	var imagesTemplate = function (match, group1, group2) {
		return '<img src="'+group2.replace(escapeQuotesRegExp, "'")+'" alt="'+group1.replace(escapeQuotesRegExp, "'")+'">';
	};

	var headingsRegExp = /^(#+) +(.*)/gm;
	var headingsTemplate = function (match, hash, content) {
		var length = hash.length; return '<h'+length+'>'+content+'</h'+length+'>';
	};

	var headingsCommonh2RegExp = /^([^\n\t ])(.*)\n----+/gm;
	var headingsCommonh1RegExp = /^([^\n\t ])(.*)\n====+/gm;
	var headingsCommonh1Template = '<h1>$1$2</h1>';
	var headingsCommonh2Template = '<h2>$1$2</h2>';

	var paragraphsRegExp = /^([^-><#\d\+\_\*\t\n\[\! \{])(.*)/gm;
	var paragraphsTemplate = '<p>$1$2</p>';

	var horizontalRegExp = /^.*?(?:---|\*\*\*|- - -|\* \* \*)/gm;
	var horizontalTemplate = '<hr>';

	var strongRegExp = /(?:\*\*|\_\_)([^\*_]+?)(?:\*\*|\_\_)/gm;
	var strongTemplate = '<strong>$1</strong>';

	var emphasisRegExp = /(?:\*|\_)([^\*_]+?)(?:\*|\_)/gm;
	var emphasisTemplate = '<em>$1</em>';

	var linksRegExp = /\[(.*?)\]\(([^\t\n ]*)(?:| "(.*)")\)+/gm;
	var linksTemplate = function (match, group1, group2, group3) {
		var link = group2.replace(escapeQuotesRegExp, "'");
		var text = group1.replace(escapeQuotesRegExp, "'");
		var title = group3 ? ' title="'+group3.replace(escapeQuotesRegExp, "'")+'"' : '';

		return '<a href="'+link+'"'+title+'>'+text+'</a>';
	};

	var listUlRegExp1 = /^[\t ]*?(?:-|\+|\*) (.*)/gm;
	var listUlRegExp2 = /(\<\/ul\>\n(.*)\<ul\>*)+/g;
	var listUlTemplate = '<ul><li>$1</li></ul>';

	var listOlRegExp1 = /^[\t ]*?(?:\d(?:\)|\.)) (.*)/gm;
	var listOlRegExp2 = /(\<\/ol\>\n(.*)\<ol\>*)+/g;
	var listOlTemplate = '<ol><li>$1</li></ol>';

	var lineBreaksRegExp = /^\n\n+/gm;
	var lineBreaksTemplate = '<br>';


	/**
	 * markdown parser
	 * 
	 * @param  {string} markdown
	 * @return {string}
	 */
	return function md (markdown) {
		var code = [];
		var index = 0;

		// format, removes tabs, leading and trailing spaces
		markdown = (
			markdown
				// XSS script tags
				.replace(XSSFilterRegExp, XSSFilterTemplate)
				// collect code blocks and replace with placeholder
				// we do this to avoid code blocks matching the paragraph regexp
				.replace(blockCodeRegExp, function (match, lang, block) {
					var placeholder = '{code-block-'+index+'}';
					var regex = new RegExp('{code-block-'+index+'}', 'g');

					code[index++] = {lang: lang, block: block, regex: regex};

					return placeholder;
				})
				// whitespace
				.replace(removeWhiteSpaceRegExp, '')
				// blockquotes
				.replace(blockQuotesRegExp, blockQuotesTemplate)
				// inline code
				.replace(inlineCodeRegExp, inlineCodeTemplate)
				// images
				.replace(imagesRegExp, imagesTemplate)
				// headings
				.replace(headingsRegExp, headingsTemplate)
				// headings h1 (commonmark)
				.replace(headingsCommonh1RegExp, headingsCommonh1Template)
				// headings h2 (commonmark)
				.replace(headingsCommonh2RegExp, headingsCommonh2Template)
				// horizontal rule 
				.replace(horizontalRegExp, horizontalTemplate)
				// unorderd lists
				.replace(listUlRegExp1, listUlTemplate).replace(listUlRegExp2, '')
				// ordered lists
				.replace(listOlRegExp1, listOlTemplate).replace(listOlRegExp2, '')
				// filter html
				.replace(htmlFilterRegExp, htmlFilterTemplate)
				// filter css
				.replace(cssFilterRegExp, cssFilterTemplate)
				// paragraphs
				.replace(paragraphsRegExp, paragraphsTemplate)
				// links
				.replace(linksRegExp, linksTemplate)
				// strong
				.replace(strongRegExp, strongTemplate)
				// emphasis
				.replace(emphasisRegExp, emphasisTemplate)
				// line breaks
				.replace(lineBreaksRegExp, lineBreaksTemplate)
				// XSS href
				.replace(XSSFilterHrefRegExp, XSSFilterHrefTemplate)
		);

		// replace code block placeholders
		for (var i = 0; i < index; i++) {
			var item = code[i];
			var lang = item.lang;
			var block = item.block;

			markdown = markdown.replace(item.regex, function (match) {
				return '<pre><code class="language-'+lang+'">'+block+'</code></pre>';
			});
		}

		return markdown;
	}
}));