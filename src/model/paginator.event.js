import { EventListener } from "domodel"

import Page from "../object/page.js"

/**
 * @global
 */
class PaginatorEventListener extends EventListener {

	/**
	 * @name itemsChanged
	 * @memberOf PaginatorEventListener
	 * @function
	 *
	*/

	/**
	 * @name offsetChanged
	 * @memberOf PaginatorEventListener
	 * @function
	 *
	*/

	/**
	 * @param {Item[]} data
	 */
	itemsSet(data) {
		const { paginator } = this.properties
		paginator._items = data.slice()
		paginator.emit("offsetReset")
		paginator.emit("itemsChanged")
	}

	/**
	 * @param {number} offset
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
	 *
	 */
	offsetReset() {
		const { paginator } = this.properties
		paginator.emit("offsetSet", 0)
	}

}

export default PaginatorEventListener
