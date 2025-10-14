import sanitize from 'sanitize-html';

interface DirtyData {
	[key: string]: unknown;
}
type SanitizedData<T> = T & {
	sanitizedHtml: string;
};
type DataToSanitize = DirtyData | DirtyData[];

export function sanitizeCmsData<T>(data: T): T {
	// const sanitize = await import('sanitize-html').then((mod) => mod.default);

	function sanitizeInternal(
		data: DirtyData | DirtyData[],
	): SanitizedData<T> | SanitizedData<T>[] | DataToSanitize {
		if (Array.isArray(data)) {
			return data.map((o) => sanitizeInternal(o)) as SanitizedData<T>[];
		} else if (typeof data === 'object' && data !== null) {
			return Object.keys(data).reduce((obj, key) => {
				if (key === 'renderHtml') {
					return {
						...obj,
						renderHtml: sanitize(data[key] as string, sanitizeOptions),
					};
				} else {
					return {
						...obj,
						[key]: sanitizeInternal(data[key] as DirtyData | DirtyData[]),
					};
				}
			}, {}) as SanitizedData<typeof data>;
		} else {
			return data;
		}
	}

	return sanitizeInternal(data as DataToSanitize) as SanitizedData<T>;
}

export async function sanitizeHtml(html: string) {
	// const sanitize = await import('sanitize-html').then((mod) => mod.default);
	return sanitize(html, sanitizeOptions);
}

const sanitizeOptions: sanitize.IOptions = {
	allowedTags: [
		'a',
		'img',
		// default options:
		'address',
		'article',
		'aside',
		'footer',
		'header',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'hgroup',
		'main',
		'nav',
		'section',
		'blockquote',
		'dd',
		'div',
		'dl',
		'dt',
		'figcaption',
		'figure',
		'hr',
		'li',
		'main',
		'ol',
		'p',
		'pre',
		'ul',
		'a',
		'abbr',
		'b',
		'bdi',
		'bdo',
		'br',
		'cite',
		'code',
		'data',
		'dfn',
		'em',
		'i',
		'kbd',
		'mark',
		'q',
		'rb',
		'rp',
		'rt',
		'rtc',
		'ruby',
		's',
		'samp',
		'small',
		'span',
		'strong',
		'sub',
		'sup',
		'time',
		'u',
		'var',
		'wbr',
		'caption',
		'col',
		'colgroup',
		'table',
		'tbody',
		'td',
		'tfoot',
		'th',
		'thead',
		'tr',
	],
	// disallowedTagsMode: 'discard',
	allowedAttributes: {
		a: ['href', 'name', 'target'],
		// We don't currently allow img itself by default, but
		// these attributes would make sense if we did.
		img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
	},
	// Lots of these won't come up by default because we don't allow them
	selfClosing: [
		'img',
		'br',
		'hr',
		'area',
		'base',
		'basefont',
		'input',
		'link',
		'meta',
	],
	// URL schemes we permit
	allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
	allowedSchemesByTag: {},
	allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
	allowProtocolRelative: true,
	enforceHtmlBoundary: false,
};
