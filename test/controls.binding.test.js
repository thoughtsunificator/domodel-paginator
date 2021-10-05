import assert from "assert"
import { JSDOM } from "jsdom"
import { Core, Binding } from "domodel"

import { PaginatorModel, PaginatorBinding, ItemBinding, Paginator, Item } from "../index.js"

import ControlsBinding from "../src/model/controls.binding.js"

const virtualDOM = new JSDOM()
const window = virtualDOM.window
const { document } = window

const model = data => ({
	tagName: "div",
	textContent: data.number
})

const RootModel = { tagName: "div" }
let rootBinding

describe("controls.binding", () => {

	beforeEach(() => {
		rootBinding = new Binding()
		Core.run(RootModel, { parentNode: document.body, binding: rootBinding })
	})

	afterEach(() => {
		rootBinding.remove()
	})

	it("instance", () => {
		assert.ok(ControlsBinding.prototype instanceof Binding)
	})

	it("previous", (done) => {
		const paginator = new Paginator(3)
		paginator._items = Array.from(Array(50)).map(() => ({ model: () => ({ tagName: "div" }), binding: Binding }))
		let count = 0
		const binding = new PaginatorBinding({ paginator })
		binding.listen(paginator, "offsetSet", offset => {
			count++
			if(count === 1) {
				assert.strictEqual(offset, 0)
			} else if(count === 2) {
				assert.strictEqual(offset, 45)
			} else if(count === 3) {
				assert.strictEqual(offset, 42)
				done()
			}
		})
		rootBinding.run(PaginatorModel, { binding })
		paginator.controls.emit("previous")
		paginator.offset = paginator.getMaximumOffset()
		paginator.controls.emit("previous")
		paginator.controls.emit("previous")
	})

	it("next", (done) => {
		const paginator = new Paginator(3)
		paginator._items = Array.from(Array(50)).map(() => ({ model: () => ({ tagName: "div" }), binding: Binding }))
		let count = 0
		const binding = new PaginatorBinding({ paginator })
		binding.listen(paginator, "offsetSet", offset => {
			count++
			if(count === 1) {
				assert.strictEqual(offset, 3)
			} else if(count === 2) {
				assert.strictEqual(offset, 48)
			} else if(count === 3) {
				assert.strictEqual(offset, 45)
				done()
			}
		})
		rootBinding.run(PaginatorModel, { binding })
		paginator.controls.emit("next")
		paginator.offset = paginator.getMaximumOffset()
		paginator.controls.emit("next")
		paginator.offset = 42
		paginator.controls.emit("next")
	})

	it("itemsChanged", (done) => {
		const paginator = new Paginator(2)
		const binding = new PaginatorBinding({ paginator })
		rootBinding.run(PaginatorModel, { binding })
		let count = 0
		binding.listen(paginator, "itemsChanged", () => {
			count++
			if(count === 1) {
				assert.strictEqual(binding.identifier.controls.identifier.totalPages.textContent, "/ 2")
				assert.strictEqual(paginator.items.length, 4)
			} else if(count === 2) {
				assert.strictEqual(binding.identifier.controls.identifier.totalPages.textContent, "/ 1")
				assert.strictEqual(paginator.items.length, 2)
			} else if(count === 3) {
				assert.strictEqual(binding.identifier.controls.identifier.totalPages.textContent, "/ 1")
				assert.strictEqual(paginator.items.length, 1)
			} else if(count === 4) {
				assert.strictEqual(binding.identifier.controls.identifier.totalPages.textContent, "/ 4")
				assert.strictEqual(paginator.items.length, 8)
				done()
			}
		})
		paginator.emit("itemsSet", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
			new Item(model, ItemBinding, { number: 3 }),
		])
		paginator.emit("itemsSet", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
		])
		paginator.emit("itemsSet", [
			new Item(model, ItemBinding, { number: 1 }),
		])
		paginator.emit("itemsSet", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
			new Item(model, ItemBinding, { number: 4 }),
			new Item(model, ItemBinding, { number: 5 }),
			new Item(model, ItemBinding, { number: 6 }),
			new Item(model, ItemBinding, { number: 7 }),
			new Item(model, ItemBinding, { number: 8 }),
		])
	})

	it("offsetChanged", (done) => {
		const paginator = new Paginator(2)
		const binding = new PaginatorBinding({ paginator })
		rootBinding.run(PaginatorModel, { binding })
		let count = 0
		binding.listen(paginator, "offsetChanged", () => {
			count++
			if(count === 1) {
				assert.strictEqual(binding.identifier.controls.identifier.jump.value, "1")
				assert.strictEqual(binding.identifier.controls.identifier.next.disabled, false)
				assert.strictEqual(binding.identifier.controls.identifier.previous.disabled, true)
			} else if(count === 2) {
				assert.strictEqual(binding.identifier.controls.identifier.jump.value, "1")
				assert.strictEqual(binding.identifier.controls.identifier.next.disabled, true)
				assert.strictEqual(binding.identifier.controls.identifier.previous.disabled, true)
				done()
			}
		})
		paginator.emit("itemsSet", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
			new Item(model, ItemBinding, { number: 3 }),
		])
		paginator.emit("itemsSet", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
		])
	})

	it("previousButton", () => {
		const paginator = new Paginator(2)
		const binding = new PaginatorBinding({ paginator })
		let emitted = false
		rootBinding.run(PaginatorModel, { binding })
		binding.listen(paginator.controls, "previous", () => {
			emitted = true
		})
		binding.identifier.controls.identifier.previous.dispatchEvent(new window.Event('click'));
		assert.ok(emitted)
	})

	it("nextButton", () => {
		const paginator = new Paginator(2)
		const binding = new PaginatorBinding({ paginator })
		let emitted = false
		rootBinding.run(PaginatorModel, { binding })
		binding.listen(paginator.controls, "next", () => {
			emitted = true
		})
		binding.identifier.controls.identifier.next.dispatchEvent(new window.Event('click'));
		assert.ok(emitted)
	})

	it("jumpButton", (done) => {
		const paginator = new Paginator(2)
		const binding = new PaginatorBinding({ paginator })
		let count = 0
		rootBinding.run(PaginatorModel, { binding })
		paginator.emit("itemsSet", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
			new Item(model, ItemBinding, { number: 3 }),
		])
		binding.listen(paginator, "offsetSet", offset => {
			count++
			if(count === 1) {
				assert.strictEqual(binding.identifier.controls.identifier.jump.value, "2")
				assert.strictEqual(offset, 2)
				assert.strictEqual(binding.identifier.controls.identifier.jump.value, "2")
			} else if(count === 2) {
				assert.strictEqual(offset, 2)
			} else if(count === 3) {
				assert.strictEqual(binding.identifier.controls.identifier.jump.value, "1")
				assert.strictEqual(offset, 0)
			} else if(count === 4) {
				assert.strictEqual(binding.identifier.controls.identifier.jump.value, "1")
				assert.strictEqual(offset, 0)
				done()
			}
		})
		binding.identifier.controls.identifier.jump.value = 2
		binding.identifier.controls.identifier.jump.dispatchEvent(new window.Event('input'));
		binding.identifier.controls.identifier.jump.value = 4
		binding.identifier.controls.identifier.jump.dispatchEvent(new window.Event('input'));
		binding.identifier.controls.identifier.jump.value = 0
		binding.identifier.controls.identifier.jump.dispatchEvent(new window.Event('input'));
		binding.identifier.controls.identifier.jump.value = -1
		binding.identifier.controls.identifier.jump.dispatchEvent(new window.Event('input'));
	})

})
