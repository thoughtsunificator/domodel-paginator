import { JSDOM } from "jsdom"
import { Core, Binding } from "domodel"

import { PaginatorModel, PaginatorBinding, ItemBinding, Paginator, Item } from "../index.js"

const virtualDOM = new JSDOM()
const { document } = virtualDOM.window

const model = data => ({
	tagName: "div",
	textContent: data.number
})

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
	test.ok(new PaginatorBinding() instanceof Binding)
	test.done()
}

export function itemsSet(test) {
	test.expect(3)
	const paginator = new Paginator(3)
	const items = [
		new Item(model, ItemBinding, { number: 1 }),
		new Item(model, ItemBinding, { number: 2 }),
		new Item(model, ItemBinding, { number: 3 }),
	]
	rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
	paginator.emit("items set", items)
	test.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
	paginator.emit("items set", items)
	test.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
	let index = 0
	rootBinding.listen(paginator, "items set", items => {
		if(index === 2) {
			test.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
			test.done()
		}
		index++
	})
	paginator.emit("items set", items)
	paginator.emit("items set", items)
	paginator.emit("items set", items)
}

export function offsetReset(test) {
	test.expect(1)
	const paginator = new Paginator(3)
	rootBinding.listen(paginator, "offset set", offset => {
		test.strictEqual(offset, 0)
		test.done()
	})
	rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
	paginator.emit("offset reset")
}

export function offsetSet(test) {
	test.expect(3)
	const paginator = new Paginator(2)
	rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
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
	let index = 0
	rootBinding.listen(paginator, "offset changed", offset => {
		if(index === 0) {
			test.strictEqual(offset, 0)
		} else if(index === 1) {
			test.strictEqual(offset, 3)
			test.done()
		}
		index++
	})
	rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
	paginator.emit("items set", [
		new Item(model, ItemBinding, { number: 1 }),
		new Item(model, ItemBinding, { number: 2 }),
		new Item(model, ItemBinding, { number: 3 }),
		new Item(model, ItemBinding, { number: 4 })
	])
	paginator.emit("offset set", 3)
}
