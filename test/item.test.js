import assert from "assert"
import { Binding, Observable } from "domodel"

import { Item } from "../index.js"

describe("item", () => {
	it("instance", () => {
		const model = { tagName: "div" }
		const item = new Item(model, Binding, { test: 1 })
		assert.ok(Item.prototype instanceof Observable)
		assert.deepEqual(item.model, model)
		assert.deepEqual(item.binding, Binding)
		assert.strictEqual(item.properties.test, 1)
		assert.throws(function() {
			paginator.model = model
			paginator.binding = binding
			paginator.properties = {}
		})
	})
})
