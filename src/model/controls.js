export default {
	tagName: "div",
	className: "pagination-controls",
	children: [
		{
			tagName: "button",
			className: "pagination-previous",
			textContent: "←",
			disabled: true,
			identifier: "previous"
		},
		{
			tagName: "div",
			className: "pagination-indicator",
			children: [
				{
					tagName: "input",
					type: "number",
					min: 1,
					value: 1,
					identifier: "jump",
					className: "pagination-jump"
				},
				{
					tagName: "span",
					identifier: "totalPages"
				}
			]
		},
		{
			tagName: "button",
			className: "pagination-next",
			textContent: "→",
			disabled: true,
			identifier: "next"
		}
	]
}
