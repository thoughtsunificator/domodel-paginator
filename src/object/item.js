/** @module item */

import { Observable } from "domodel"

/**
 * @memberof: module:item
 */
class Item extends Observable {

	/**
	 * @param {object} model
	 * @param {Binding} binding
	 * @param {object} properties
	 */
	constructor(model, binding, properties) {
		super()
		this._model = model
		this._binding = binding
		this._properties = properties
	}

	/**
	 * @type {Object}
	 */
	get model() {
		return this._model
	}

	/**
	 * @type {Binding}
	 */
	get binding() {
		return this._binding
	}

	/**
	 * @type {object}
	 */
	get properties() {
		return this._properties
	}

}

export default Item
