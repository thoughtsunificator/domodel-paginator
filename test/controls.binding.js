import { JSDOM } from "jsdom"
import { Core } from "domodel"

import PaginatorModel from "../src/model/paginator.js"

import PaginatorBinding from "../src/model/paginator.binding.js"
import ItemBinding from "../src/model/item.binding.js"

import Paginator from "../src/object/paginator.js"
import Item from "../src/object/item.js"

const virtualDOM = new JSDOM()
const window = virtualDOM.window
const { document } = window

const model = data => ({
	tagName: "div",
	textContent: data.number
})

export function previous(test) {
	test.expect(3)
	const paginator = new Paginator(3)
	let count = 0
	paginator.listen("offset set", offset => {
		count++
		test.strictEqual(offset, paginator.getPreviousOffset())
		if(count === 3) {
			test.done()
		}
	})
	Core.run(PaginatorModel, { parentNode: document.body, binding: new PaginatorBinding({ paginator }) })
	paginator.emit("previous")
	paginator.offset = 50
	paginator.emit("previous")
	paginator.emit("previous")
}

export function next(test) {
	test.expect(3)
	const paginator = new Paginator(3)
	let count = 0
	paginator.listen("offset set", offset => {
		count++
		test.strictEqual(offset, paginator.getNextOffset())
		if(count === 3) {
			test.done()
		}
	})
	Core.run(PaginatorModel, { parentNode: document.body, binding: new PaginatorBinding({ paginator }) })
	paginator.emit("next")
	paginator.offset = 43
	paginator.emit("next")
	paginator.emit("next")
}

export function itemsChanged(test) {
	test.expect(8)
	const paginator = new Paginator(2)
	const binding = new PaginatorBinding({ paginator })
	Core.run(PaginatorModel, { parentNode: document.body, binding })
	let count = 0
	paginator.listen("items changed", () => {
		count++
		if(count === 1) {
			test.strictEqual(binding.identifier.controls.identifier.totalPages.textContent, "/ 2")
			test.strictEqual(paginator.items.length, 4)
		} else if(count === 2) {
			test.strictEqual(binding.identifier.controls.identifier.totalPages.textContent, "/ 1")
			test.strictEqual(paginator.items.length, 2)
		} else if(count === 3) {
			test.strictEqual(binding.identifier.controls.identifier.totalPages.textContent, "/ 1")
			test.strictEqual(paginator.items.length, 1)
		} else if(count === 4) {
			test.strictEqual(binding.identifier.controls.identifier.totalPages.textContent, "/ 4")
			test.strictEqual(paginator.items.length, 8)
			test.done()
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
}

export function offsetChanged(test) {
	test.expect(6)
	const paginator = new Paginator(2)
	const binding = new PaginatorBinding({ paginator })
	Core.run(PaginatorModel, { parentNode: document.body, binding })
	let count = 0
	paginator.listen("offset changed", () => {
		count++
		if(count === 1) {
			test.strictEqual(binding.identifier.controls.identifier.jump.value, "1")
			test.strictEqual(binding.identifier.controls.identifier.next.disabled, false)
			test.strictEqual(binding.identifier.controls.identifier.previous.disabled, true)
		} else if(count === 2) {
			test.strictEqual(binding.identifier.controls.identifier.jump.value, "1")
			test.strictEqual(binding.identifier.controls.identifier.next.disabled, true)
			test.strictEqual(binding.identifier.controls.identifier.previous.disabled, true)
			test.done()
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
}

export function previousButton(test) {
	test.expect(1)
	const paginator = new Paginator(2)
	const binding = new PaginatorBinding({ paginator })
	let emitted = false
	Core.run(PaginatorModel, { parentNode: document.body, binding })
	paginator.listen("previous", () => {
		emitted = true
	})
	binding.identifier.controls.identifier.previous.dispatchEvent(new window.Event('click'));
	test.ok(emitted)
	test.done()
}

export function nextButton(test) {
	test.expect(1)
	const paginator = new Paginator(2)
	const binding = new PaginatorBinding({ paginator })
	let emitted = false
	Core.run(PaginatorModel, { parentNode: document.body, binding })
	paginator.listen("next", () => {
		emitted = true
	})
	binding.identifier.controls.identifier.next.dispatchEvent(new window.Event('click'));
	test.ok(emitted)
	test.done()
}

export function jumpButton(test) {
	test.expect(8)
	const paginator = new Paginator(2)
	const binding = new PaginatorBinding({ paginator })
	let count = 0
	Core.run(PaginatorModel, { parentNode: document.body, binding })
	paginator.emit("items set", [
		new Item(model, ItemBinding, { number: 1 }),
		new Item(model, ItemBinding, { number: 2 }),
		new Item(model, ItemBinding, { number: 3 }),
		new Item(model, ItemBinding, { number: 3 }),
	])
	paginator.listen("offset set", offset => {
		count++
		console.log(offset)
		if(count === 1) {
			test.strictEqual(binding.identifier.controls.identifier.jump.value, "2")
			test.strictEqual(offset, 2)
			test.strictEqual(binding.identifier.controls.identifier.jump.value, "2")
		} else if(count === 2) {
			test.strictEqual(offset, 2)
		} else if(count === 3) {
			test.strictEqual(binding.identifier.controls.identifier.jump.value, "1")
			test.strictEqual(offset, 0)
		} else if(count === 4) {
			test.strictEqual(binding.identifier.controls.identifier.jump.value, "1")
			test.strictEqual(offset, 0)
			test.done()
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
}
