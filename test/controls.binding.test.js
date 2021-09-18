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
		assert.ok(new ControlsBinding() instanceof Binding)
	})

	it("previous", (done) => {
		const paginator = new Paginator(3)
		let count = 0
		const binding = new PaginatorBinding({ paginator })
		binding.listen(paginator, "offset set", offset => {
			count++
			assert.strictEqual(offset, paginator.getPreviousOffset())
			if(count === 3) {
				done()
			}
		})
		rootBinding.run(PaginatorModel, { binding })
		paginator.emit("previous")
		paginator.offset = 50
		paginator.emit("previous")
		paginator.emit("previous")
	})

	it("next", (done) => {
		const paginator = new Paginator(3)
		let count = 0
		const binding = new PaginatorBinding({ paginator })
		binding.listen(paginator, "offset set", offset => {
			count++
			assert.strictEqual(offset, paginator.getNextOffset())
			if(count === 3) {
				done()
			}
		})
		rootBinding.run(PaginatorModel, { binding })
		paginator.emit("next")
		paginator.offset = 43
		paginator.emit("next")
		paginator.emit("next")
	})

	it("itemsChanged", (done) => {
		const paginator = new Paginator(2)
		const binding = new PaginatorBinding({ paginator })
		rootBinding.run(PaginatorModel, { binding })
		let count = 0
		binding.listen(paginator, "items changed", () => {
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
		paginator.emit("items set", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
			new Item(model, ItemBinding, { number: 3 }),
		])
		paginator.emit("items set", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
		])
		paginator.emit("items set", [
			new Item(model, ItemBinding, { number: 1 }),
		])
		paginator.emit("items set", [
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
		binding.listen(paginator, "offset changed", () => {
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
		paginator.emit("items set", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
			new Item(model, ItemBinding, { number: 3 }),
		])
		paginator.emit("items set", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
		])
	})

	it("previousButton", () => {
		const paginator = new Paginator(2)
		const binding = new PaginatorBinding({ paginator })
		let emitted = false
		rootBinding.run(PaginatorModel, { binding })
		binding.listen(paginator, "previous", () => {
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
		binding.listen(paginator, "next", () => {
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
		paginator.emit("items set", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
			new Item(model, ItemBinding, { number: 3 }),
		])
		binding.listen(paginator, "offset set", offset => {
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
