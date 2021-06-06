import ControlsModel from "./controls.js"

import ControlsBinding from "./controls.binding.js"

export default {
	tagName: "div",
	className: "paginator",
	children: [
		{
			tagName: "div",
			className: "pagination-content",
			identifier: "content"
		},
		{
			model: ControlsModel,
			binding: ControlsBinding,
			identifier: "controls"
		}
	]
}
