import { JSDOM } from "jsdom"
import { Core } from "domodel"

import ItemBinding from "../src/model/item.binding.js"

import Page from "../src/object/page.js"

const virtualDOM = new JSDOM()
const { document } = virtualDOM.window

const model = {
	tagName: "div"
}

export function clear(test) {
	test.expect(2)
	const page = new Page()
	Core.run(model, { parentNode: document.body, binding: new ItemBinding({ page }) })
	test.strictEqual(document.body.innerHTML, "<div></div>")
	page.emit("clear")
	test.strictEqual(document.body.innerHTML, "")
	test.done()
}
