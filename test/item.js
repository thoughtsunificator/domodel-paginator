import { Binding, Observable } from "domodel"

import { Item } from "../index.js"

export function instance(test) {
	test.expect(5)
	const model = { tagName: "div" }
	const item = new Item(model, Binding, { test: 1 })
	test.ok(item instanceof Observable)
	test.deepEqual(item.model, model)
	test.deepEqual(item.binding, Binding)
	test.strictEqual(item.properties.test, 1)
	test.throws(function() {
		paginator.model = model
		paginator.binding = binding
		paginator.properties = {}
	})
	test.done()
}
