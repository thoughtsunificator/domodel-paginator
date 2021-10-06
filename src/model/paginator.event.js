import { EventListener } from "domodel"

import Page from "../object/page.js"

/**
 * @global
 */
class PaginatorEventListener extends EventListener {

	/**
	 * @event PaginatorEventListener#itemsChanged
	 *
	*/

	/**
	 * @event PaginatorEventListener#offsetChanged
	 *
	*/

	/**
	 * @event PaginatorEventListener#itemsSet
	 * @property {Item[]} data
	 */
	itemsSet(data) {
		const { paginator } = this.properties
		paginator._items = data.slice()
		paginator.emit("offsetReset")
		paginator.emit("itemsChanged")
	}

	/**
	 * @event PaginatorEventListener#offsetSet
	 * @property {number} offset
	 */
	offsetSet(offset) {
		const { paginator } = this.properties
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
		paginator.emit("offsetChanged", offset)
	}

	/**
	 * @event PaginatorEventListener#offsetReset
	 */
	offsetReset() {
		const { paginator } = this.properties
		paginator.emit("offsetSet", 0)
	}

}

export default PaginatorEventListener
