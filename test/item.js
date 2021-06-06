import { Binding } from "domodel"

import Item from "../src/object/item.js"

export function instance(test) {
	test.expect(3)
	const model = { tagName: "div" }
	const binding = new Binding()
	const item = new Item(model, binding, { test: 1 })
	test.deepEqual(item.model, model)
	test.deepEqual(item.binding, binding)
	test.strictEqual(item.properties.test, 1)
	test.done()
}
