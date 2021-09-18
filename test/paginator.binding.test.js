import assert from "assert"
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

describe("paginator.binding", () => {

	beforeEach(() => {
		rootBinding = new Binding()
		Core.run(RootModel, { parentNode: document.body, binding: rootBinding })
	})

	afterEach(() => {
		rootBinding.remove()
	})

	it("instance", () => {
		assert.ok(new PaginatorBinding() instanceof Binding)
	})

	it("itemsSet", (done) => {
		const paginator = new Paginator(3)
		const items = [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
		]
		rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
		paginator.emit("items set", items)
		assert.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
		paginator.emit("items set", items)
		assert.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
		let index = 0
		rootBinding.listen(paginator, "items set", items => {
			if(index === 2) {
				assert.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
				done()
			}
			index++
		})
		paginator.emit("items set", items)
		paginator.emit("items set", items)
		paginator.emit("items set", items)
	})

	it("offsetReset", (done) => {
		const paginator = new Paginator(3)
		rootBinding.listen(paginator, "offset set", offset => {
			assert.strictEqual(offset, 0)
			done()
		})
		rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
		paginator.emit("offset reset")
	})

	it("offsetSet", () => {
		const paginator = new Paginator(2)
		rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
		paginator.emit("items set", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
			new Item(model, ItemBinding, { number: 4 })
		])
		paginator.emit("offset set", 2)
		assert.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>3</div><div>4</div>")
		paginator.emit("offset set", 20)
		assert.strictEqual(paginator.offset, 2)
		paginator.emit("offset set", -5)
		assert.strictEqual(paginator.offset, 0)
	})

	it("offsetChanged", (done) => {
		const paginator = new Paginator(3)
		let index = 0
		rootBinding.listen(paginator, "offset changed", offset => {
			if(index === 0) {
				assert.strictEqual(offset, 0)
			} else if(index === 1) {
				assert.strictEqual(offset, 3)
				done()
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
	})

})
