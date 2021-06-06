/** @module paginator */

import { Observable } from "domodel"

/**
 * @memberof: module:paginator
 */
class Paginator extends Observable {

	/**
	 * @param {number} limit
	 */
	constructor(limit) {
		super()
		this._items = []
		this._limit = limit
		this._offset = 0
		this._page = null
	}

	/**
	 * @returns {Item[]}
	 */
	getCurrentItems() {
		return this.items.slice(this.offset, Math.min(this.items.length, this.offset + this.limit))
	}

	/**
	 * @returns {Item[]}
	 */
	getNextItems() {
		const offset = this.getNextOffset();
		return this.items.slice(offset, Math.min(this.items.length, offset + this.limit))
	}

	/**
	 * @returns {Item[]}
	 */
	getPreviousItems() {
		const offset = this.getPreviousOffset();
		return this.items.slice(offset, Math.min(this.items.length, offset + this.limit))
	}

	/**
	 * @param   {number} offset
	 * @returns {Item[]}
	 */
	getItemsByOffset(offset) {
		return this.items.slice(offset, Math.min(this.items.length, offset + this.limit))
	}

	/**
	 * @returns {number}
	 */
	getMaximumOffset() {
		const offset = Math.max(0, this.items.length - this.limit)
		return this.getNearestOffset(offset)
	}

	/**
	 * @returns {number}
	 */
	getMaximumPage() {
		return Math.ceil(this.items.length / this.limit)
	}

	/**
	 * @returns {number}
	 */
	getCurrentPage() {
		return Math.floor((this.offset + this.limit) / this.limit)
	}

	/**
	 * @param   {number} offset
	 * @returns {number}
	 */
	getPageByOffset(offset) {
		return Math.ceil((offset + this.limit) / this.limit)
	}

	/**
	 * @param   {number} offset
	 * @returns {number}
	 */
	getOffsetByPage(offset) {
		return offset * this.limit - this.limit
	}

	/**
	 * @returns {number}
	 */
	getPreviousOffset() {
		return Math.max(0, this.offset - this.limit)
	}

	/**
	 * @returns {number}
	 */
	getNextOffset() {
		const offset = this.getMaximumOffset();
		return Math.min(offset, this.offset + this.limit)
	}

	/**
	 * @param   {number} offset
	 * @returns {number}
	 */
	getNearestOffset(offset) {
		return this.limit * Math.ceil(offset / this.limit)
	}

	/**
	 * @type {Item[]}
	 */
	get items() {
		return this._items
	}

	/**
	 * @type {number}
	 */
	get limit() {
		return this._limit
	}

	/**
	 * @type {number}
	 */
	get offset() {
		return this._offset
	}

	set offset(offset) {
		this._offset = offset
	}

	/**
	 * @type {Page}
	 */
	get page() {
		return this._page
	}

	set page(page) {
		this._page = page
	}

}

export default Paginator
