import { Observable } from "domodel"

/**
 * @global
 */
class Item extends Observable {

	/**
	 * @param {object}  model
	 * @param {Binding} binding
	 * @param {object}  properties
	 */
	constructor(model, binding, properties) {
		super()
		this._model = model
		this._binding = binding
		this._properties = properties
	}

	/**
	 * @readonly
	 * @type {Object}
	 */
	get model() {
		return this._model
	}

	/**
	 * @readonly
	 * @type {Binding}
	 */
	get binding() {
		return this._binding
	}

	/**
	 * @readonly
	 * @type {object}
	 */
	get properties() {
		return this._properties
	}

}

export default Item
