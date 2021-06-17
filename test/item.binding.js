import { JSDOM } from "jsdom"
import { Core, Binding } from "domodel"

import ItemBinding from "../src/model/item.binding.js"

import Page from "../src/object/page.js"

const virtualDOM = new JSDOM()
const { document } = virtualDOM.window

const model = {
	tagName: "div"
}

const RootModel = { tagName: "div" }
let rootBinding

export function setUp(callback) {
	rootBinding = new Binding()
	Core.run(RootModel, { parentNode: document.body, binding: rootBinding })
	callback()
}

export function tearDown(callback) {
	rootBinding.remove()
	callback()
}

export function instance(test) {
	test.expect(1)
	test.ok(new ItemBinding() instanceof Binding)
	test.done()
}

export function clear(test) {
	test.expect(2)
	const page = new Page()
	const binding = new ItemBinding({ page })
	rootBinding.run(model, { binding })
	test.strictEqual(rootBinding.root.innerHTML, "<div></div>")
	page.emit("clear")
	test.strictEqual(rootBinding.root.innerHTML, "")
	test.done()
}
