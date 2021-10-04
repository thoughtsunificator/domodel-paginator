import { Binding } from "domodel"

/**
 * @global
 */
class ItemBinding extends Binding {

	/**
	 * @param {object} properties
	 * @param {Paginator} properties.page
	 */
	constructor(properties) {
		super(properties)
	}

	onCreated() {

		const { page } = this.properties

		this.listen(page, "clear", () => {
			this.remove()
		})

	}

}

export default ItemBinding
