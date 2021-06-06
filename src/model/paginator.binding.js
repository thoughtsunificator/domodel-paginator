import { Binding, Observable } from "domodel"

import Page from "../object/page.js"

export default class extends Binding {

	onCreated() {
		const { paginator } = this.properties

		this.listen(paginator, "items set", data => {
			paginator._items = data.slice()
			paginator.emit("offset reset")
			paginator.emit("items changed")
		})

		this.listen(paginator, "offset reset", () => paginator.emit("offset set", 0))

		this.listen(paginator, "offset set", offset => {
			if(paginator.page !== null) {
				paginator.page.emit("clear")
			}
			if(offset < paginator.limit) {
				offset = 0
			} else if(offset > paginator.items.length - 1) {
				offset = paginator.getMaximumOffset()
			} else if(offset % paginator.limit != 0) {
				offset = paginator.getNearestOffset(offset)
			}
			paginator.offset = offset
			const page = new Page()
			for (const item of paginator.getCurrentItems()) {
				this.run(item.model(item.properties), {
					parentNode: this.identifier.content,
					binding: new item.binding({
						...item.properties,
						item,
						page
					})
				})
			}
			paginator.page = page
			paginator.emit("offset changed", offset)
		})
	}

}
