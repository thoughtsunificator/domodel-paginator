import { Binding } from "domodel"

export default class extends Binding {

	onCreated() {

		const { page } = this.properties

		this.listen(page, "clear", () => this.remove())

	}

}
