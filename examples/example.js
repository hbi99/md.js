var markdown = (
	'Use the `printf()` function.\n\n'+

	'```javascript\n\n\t\tvar i = 10;\nvar foo = 2;\n<script>1</script>\n```' +

`
	# Heading 1
	## Heading 2
	### Heading 3
	#### *Heading 4*

	<img onerror="alert()">
	<img src="" alt="<a href="onerror='alert(String.fromCharCode(88,83,83))'b="></a>">

	Heading 1 (commonmark)
	====

	Heading 2 (commonmark)
	----

	![Alt text](https://thysultan.com/dio/assets/logo.svg)

	This is [an example](http://example.com/ "Title") inline link.

	***

	Paragraphs Lorem ipsum ~~strike this~~ sit amet, _consectetur_ adipisicing elit. 
	Cupiditate doloremque sed vero __excepturi__.  

	Lorem ipsum dolor sit amet, *consectetur* adipisicing elit. 
	Cupiditate doloremque sed vero **excepturi**.

	[a link](http://google.com)

	- [ ] ul list 1
	- [x] ul list 2

	- ul list 1
	- ul list 2

	* ul list 1
	* ul list 2
	* ul list 3

	+ ul list 1
	+ ul list 2

	1. ol list 1
	2. ol list 2
	3. ol list 3

	1) ol list 1
	2) ol list 2
	3) ol list 3

	> hello world what is this

	---

	<table>
	    <tr>
	        <td>This is an html table block</td>
	    </tr>
	</table>

	<div style="color:red">This is a styled html div</div>

	<div>
		Isolated Text In html block
	</div>

	<style>
		#foo {
			color: red;
		}
	</style>

	XSS With Image ![]("onerror="alert())

	XSS Anchors [test]("onerror="alert())

	Another paragraphs # Heading, will not match this
	Escape \\* should world and so should \\# as well as \\~~strike right?

	## XSS Tests

	<IMG SRC="javascript:alert('XSS');">

	
	<a href="javascript:alert('xss')">*you*</a>

	
	XSS filter <script>alert(1);</script> should not alert.

	
	XSS filter upperCase <SCRIPT>alert(1);</SCRIPT> should not alert.


	XSS filter href <a href="javascript:alert('xss')">you</a>


	XSS filter upperCase href <a HREF="javascript:alert('xss')">you</a>


	<IMG SRC= onmouseover="alert('xxs')">


	<IMG """><SCRIPT>alert("XSS")</SCRIPT>">


	<IMG SRC="jav	ascript:alert('XSS');">


	<IMG SRC="jav&#x0A;ascript:alert('XSS');">

	---

	Trailing Paragraph Lorem ipsum dolor sit amet, _consectetur_ adipisicing elit. 
	Cupiditate doloremque sed vero __excepturi__.`);

// markdown = '#  Title\n\nAnd *now* [a link](http://www.google.com) to **follow** and [another](http://yahoo.com/).\n\n* One\n* Two\n* Three\n\n## Subhead\n\nOne **two** three **four** five.\n\nOne __two__ three _four_ five __six__ seven _eight_.\n\n1. One\n2. Two\n3. Three\n\nMore text with `inline($code)` and :"quote": sample.\n\n> A block quote\n> across two lines.\nMore text...';

var html = md(markdown);
document.body.insertAdjacentHTML('beforeend', html);

// console.log(html);

console.log(md('![](" onerror="alert())'));

console.log(md('<img src="" onerror=onerror="alert()">'));

console.log(md('<script language="text/javascript">alert()</script>'));

console.log(md("![[](onerror='alert(String.fromCharCode(88,83,83))'b=)]()"));

console.log(md(`
<blockquote>
	<p>hello <a name="n"
	href="javascript:alert('xss')"><em>you</em></a></p>
</blockquote>
`));

console.log(md(`
	[some text](javascript:alert('xss'))
`));