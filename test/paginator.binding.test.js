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
		assert.ok(PaginatorBinding.prototype instanceof Binding)
	})

	it("itemsSet", (done) => {
		const paginator = new Paginator(3)
		const items = [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
		]
		rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
		paginator.emit("itemsSet", items)
		assert.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
		paginator.emit("itemsSet", items)
		assert.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
		let index = 0
		rootBinding.listen(paginator, "itemsSet", items => {
			if(index === 2) {
				assert.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>1</div><div>2</div><div>3</div>")
				done()
			}
			index++
		})
		paginator.emit("itemsSet", items)
		paginator.emit("itemsSet", items)
		paginator.emit("itemsSet", items)
	})

	it("offsetReset", (done) => {
		const paginator = new Paginator(3)
		rootBinding.listen(paginator, "offsetSet", offset => {
			assert.strictEqual(offset, 0)
			done()
		})
		rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
		paginator.emit("offsetReset")
	})

	it("offsetSet", () => {
		const paginator = new Paginator(2)
		rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
		paginator.emit("itemsSet", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
			new Item(model, ItemBinding, { number: 4 })
		])
		paginator.emit("offsetSet", 2)
		assert.strictEqual(document.querySelector(".paginator .pagination-content").innerHTML, "<div>3</div><div>4</div>")
		paginator.emit("offsetSet", 20)
		assert.strictEqual(paginator.offset, 2)
		paginator.emit("offsetSet", -5)
		assert.strictEqual(paginator.offset, 0)
	})

	it("offsetChanged", (done) => {
		const paginator = new Paginator(3)
		let index = 0
		rootBinding.listen(paginator, "offsetChanged", offset => {
			if(index === 0) {
				assert.strictEqual(offset, 0)
			} else if(index === 1) {
				assert.strictEqual(offset, 3)
				done()
			}
			index++
		})
		rootBinding.run(PaginatorModel, { binding: new PaginatorBinding({ paginator }) })
		paginator.emit("itemsSet", [
			new Item(model, ItemBinding, { number: 1 }),
			new Item(model, ItemBinding, { number: 2 }),
			new Item(model, ItemBinding, { number: 3 }),
			new Item(model, ItemBinding, { number: 4 })
		])
		paginator.emit("offsetSet", 3)
	})

})
