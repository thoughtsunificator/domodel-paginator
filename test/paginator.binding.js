import { JSDOM } from "jsdom"
import { Core, Binding } from "domodel"

import PaginatorModel from "../src/model/paginator.js"

import PaginatorBinding from "../src/model/paginator.binding.js"
import ItemBinding from "../src/model/item.binding.js"

import Paginator from "../src/object/paginator.js"
import Item from "../src/object/item.js"

const virtualDOM = new JSDOM()
const { document } = virtualDOM.window

const model = data => ({
	tagName: "div",
	textContent: data.number
})

export function setUp(callback) {
	document.body.innerHTML = ""
	callback()
}

export function itemsSet(test) {
	test.expect(3)
	const paginator = new Paginator(3)
	const items = [
		new Item(model, ItemBinding, { number: 1 }),
		new Item(model, ItemBinding, { number: 2 }),
		new Item(model, ItemBinding, { number: 3 }),
	]
	Core.run(PaginatorModel, { parentNode: document.body, binding: new PaginatorBinding({ paginator }) })
	paginator.emit("items set", items)
	test.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
	paginator.emit("items set", items)
	test.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
	let count = 0
	paginator.listen("items set", items => {
		count++
		if(count === 3) {
			test.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
			test.done()
		}
	})
	paginator.emit("items set", items)
	paginator.emit("items set", items)
	paginator.emit("items set", items)
}

export function offsetReset(test) {
	test.expect(1)
	const paginator = new Paginator(3)
	paginator.listen("offset set", offset => {
		test.strictEqual(offset, 0)
		test.done()
	})
	Core.run(PaginatorModel, { parentNode: document.body, binding: new PaginatorBinding({ paginator }) })
	paginator.emit("offset reset")
}

export function offsetSet(test) {
	test.expect(3)
	const paginator = new Paginator(2)
	Core.run(PaginatorModel, { parentNode: document.body, binding: new PaginatorBinding({ paginator }) })
	paginator.emit("items set", [
		new Item(model, ItemBinding, { number: 1 }),
		new Item(model, ItemBinding, { number: 2 }),
		new Item(model, ItemBinding, { number: 3 }),
		new Item(model, ItemBinding, { number: 4 })
	])
	paginator.emit("offset set", 2)
	test.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>3</div><div>4</div>")
	paginator.emit("offset set", 20)
	test.strictEqual(paginator.offset, 2)
	paginator.emit("offset set", -5)
	test.strictEqual(paginator.offset, 0)
	test.done()
}

export function offsetChanged(test) {
	test.expect(2)
	const paginator = new Paginator(3)
	let count = 0
	paginator.listen("offset changed", offset => {
		count++
		if(count === 1) {
			test.strictEqual(offset, 0)
		} else if(count === 2) {
			test.strictEqual(offset, 3)
			test.done()
		}
	})
	Core.run(PaginatorModel, { parentNode: document.body, binding: new PaginatorBinding({ paginator }) })
	paginator.emit("items set", [
		new Item(model, ItemBinding, { number: 1 }),
		new Item(model, ItemBinding, { number: 2 }),
		new Item(model, ItemBinding, { number: 3 }),
		new Item(model, ItemBinding, { number: 4 })
	])
	paginator.emit("offset set", 3)
}
