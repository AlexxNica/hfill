// assign appropriate role & aria-level to contextual headings
export default (document = window.document, tag = 'x-h') => {
	// sectioning tags matcher
	const sectionMatch = /^(article|aside|nav|section)$/i;

	// heading tag matcher
	const headingMatch = new RegExp(`^${tag}$`, 'i');

	// assign heading by outline depth
	const assignHeadingByElement = (element) => {
		// default level is 1
		let level = 1;

		// increase the level for each sectioning ancestor
		let ascend = element;

		while (ascend = ascend.parentElement) {
			if (sectionMatch.test(ascend.nodeName)) {
				++level;
			} else if (headingMatch.test(ascend.nodeName)) {
				return;
			}
		}

		// assign the heading role and aria-level
		element.setAttribute('role', 'heading');
		element.setAttribute('aria-level', level);
	};

	// assign headings by document
	Array.prototype.forEach.call(
		document.getElementsByTagName(tag),
		assignHeadingByElement
	);

	// assign levels by mutations
	const assignHeadingsByMutations = (mutations) => mutations.reduce(
		(nodes, mutation) => nodes.concat.apply(nodes, mutation.addedNodes),
		[]
	).reduce(
		(nodes, node) => nodes.concat.apply(
			nodes,
			headingMatch.test(node) ? node : // eslint-disable-line no-nested-ternary
			node.getElementsByTagName ? node.getElementsByTagName(tag) : []
		),
		[]
	).forEach(assignHeadingByElement);

	new MutationObserver(assignHeadingsByMutations).observe(
		document.documentElement,
		{
			childList: true,
			subtree: true
		}
	);
}
