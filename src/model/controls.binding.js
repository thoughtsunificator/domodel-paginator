import { Binding } from "domodel"

import ControlsEventListener from "./controls.event.js"

/**
 * @global
 */
class ControlsBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Paginator} properties.paginator
	 */
	constructor(properties) {
		super(properties, new ControlsEventListener(properties.paginator.controls))
	}

	onCreated() {

		const { paginator } = this.properties

		this.listen(paginator, "itemsChanged", () => {
			const maximumOffset = paginator.getMaximumOffset()
			const maximumPage = paginator.getMaximumPage()
			this.identifier.totalPages.textContent = `/ ${maximumPage}`
		})

		this.listen(paginator, "offsetChanged", () => {
			const maximumOffset = paginator.getMaximumOffset()
			if(0 === paginator.offset) {
				this.identifier.previous.disabled = true
			} else if(paginator.offset > 0) {
				this.identifier.previous.disabled = false
			}
			if(paginator.offset === maximumOffset) {
				this.identifier.next.disabled = true
			} else if(maximumOffset > 0) {
				this.identifier.next.disabled = false
			}
			const currentPage = paginator.getCurrentPage()
			if(this.identifier.jump.value !== currentPage) {
				this.identifier.jump.value = currentPage
			}
		})

		this.identifier.previous.addEventListener("click", () => paginator.emit("previous"))

		this.identifier.next.addEventListener("click", () => paginator.emit("next"))

		this.identifier.jump.addEventListener("input", event => {
			const maximumPage = paginator.getMaximumPage()
			if(event.target.value <= 0) {
				this.identifier.jump.value = 1
			} else if(event.target.value > maximumPage) {
				this.identifier.jump.value = maximumPage
			}
			const offset = paginator.getOffsetByPage(parseInt(this.identifier.jump.value))
			paginator.emit("offsetSet", offset)
		})

	}

}

export default ControlsBinding
