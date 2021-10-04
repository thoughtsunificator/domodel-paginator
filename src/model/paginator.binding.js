import { Binding, Observable } from "domodel"

import PaginatorEventListener from "./paginator.event.js"

/**
 * @global
 */
class PaginatorBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Paginator} properties.paginator
	 */
	constructor(properties) {
		super(properties, new PaginatorEventListener(properties.paginator))
	}

}

export default PaginatorBinding
