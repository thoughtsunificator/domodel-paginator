import assert from "assert"
import { JSDOM } from "jsdom"
import { Core, Binding } from "domodel"

import { ItemBinding } from "../index.js"

import Page from "../src/object/page.js"

const virtualDOM = new JSDOM()
const { document } = virtualDOM.window

const model = {
	tagName: "div"
}

const RootModel = { tagName: "div" }
let rootBinding

describe("item.binding", () => {

	beforeEach(() => {
		rootBinding = new Binding()
		Core.run(RootModel, { parentNode: document.body, binding: rootBinding })
	})

	afterEach(() => {
		rootBinding.remove()
	})

	it("instance", () => {
		assert.ok(new ItemBinding() instanceof Binding)
	})

	it("clear", () => {
		const page = new Page()
		const binding = new ItemBinding({ page })
		rootBinding.run(model, { binding })
		assert.strictEqual(rootBinding.root.innerHTML, "<div></div>")
		page.emit("clear")
		assert.strictEqual(rootBinding.root.innerHTML, "")
	})

})
