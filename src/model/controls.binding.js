import { Binding } from "domodel"

export default class extends Binding {

	onCreated() {

		const { paginator } = this.properties

		this.listen(paginator, "previous", () => paginator.emit("offset set", paginator.getPreviousOffset()))

		this.listen(paginator, "next", () => paginator.emit("offset set", paginator.getNextOffset()))

		this.listen(paginator, "items changed", () => {
			const maximumOffset = paginator.getMaximumOffset()
			const maximumPage = paginator.getMaximumPage()
			this.identifier.totalPages.textContent = `/ ${maximumPage}`
		})

		this.listen(paginator, "offset changed", () => {
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
			paginator.emit("offset set", offset)
		})

	}

}
