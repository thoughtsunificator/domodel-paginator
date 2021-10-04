import { EventListener } from "domodel"

/**
 * @global
 */
class ControlsEventListener extends EventListener {

	/**
	 *
	 */
	previous() {
		const { paginator } = this.properties
		paginator.emit("offsetSet", paginator.getPreviousOffset())
	}

	/**
	 *
	 */
	next() {
		const { paginator } = this.properties
		paginator.emit("offsetSet", paginator.getNextOffset())
	}

}

export default ControlsEventListener
