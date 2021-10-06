import { EventListener } from "domodel"

/**
 * @global
 */
class ControlsEventListener extends EventListener {

	/**
	 * @event ControlsEventListener#previous
	 */
	previous() {
		const { paginator } = this.properties
		paginator.emit("offsetSet", paginator.getPreviousOffset())
	}

	/**
	 * @event ControlsEventListener#next
	 */
	next() {
		const { paginator } = this.properties
		paginator.emit("offsetSet", paginator.getNextOffset())
	}

}

export default ControlsEventListener
