import assert from "assert"
import { Observable } from "domodel"

import { Paginator } from "../index.js"

describe("paginator", () => {

	it("instance", () => {
		const paginator = new Paginator(5)
		assert.ok(paginator instanceof Observable)
		assert.ok(Array.isArray(paginator.items))
		assert.strictEqual(paginator.items.length, 0)
		assert.strictEqual(paginator.limit, 5)
		assert.strictEqual(paginator.offset, 0)
		assert.doesNotThrow(function() {
			paginator.offset = 1
			paginator.page = new Observable()
		})
		assert.throws(function() {
			paginator.items = []
			paginator.limit = 1
		})
	})

	it("getMaximumOffset", () => {
		const paginator = new Paginator(3)
		paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
		assert.strictEqual(paginator.getMaximumOffset(), 6)
		paginator._limit = 1
		assert.strictEqual(paginator.getMaximumOffset(), 7)
		paginator._limit = 3
		paginator._items = [1, 2, 3, 4]
		assert.strictEqual(paginator.getMaximumOffset(), 3)
		paginator._limit = 2
		assert.strictEqual(paginator.getMaximumOffset(), 2)
	})

	it("getNearestOffset", () => {
		const paginator = new Paginator(3)
		assert.strictEqual(paginator.getNearestOffset(2), 3)
		assert.strictEqual(paginator.getNearestOffset(3), 3)
		assert.strictEqual(paginator.getNearestOffset(0), 0)
		assert.strictEqual(paginator.getNearestOffset(4), 6)
		assert.strictEqual(paginator.getNearestOffset(6), 6)
		paginator._limit = 2
		assert.strictEqual(paginator.getNearestOffset(0), 0)
		assert.strictEqual(paginator.getNearestOffset(2), 2)
		assert.strictEqual(paginator.getNearestOffset(3), 4)
	})

	it("getPreviousOffset", () => {
		const paginator = new Paginator(5)
		paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
		assert.strictEqual(paginator.getPreviousOffset(), 0)
		paginator.offset = 10
		assert.strictEqual(paginator.getPreviousOffset(), 5)
		paginator.offset = 15
		assert.strictEqual(paginator.getPreviousOffset(), 10)
		paginator._limit = 4
		assert.strictEqual(paginator.getPreviousOffset(), 11)
	})

	it("getNextOffset", () => {
		const paginator = new Paginator(5)
		const items =
		paginator._items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
		assert.strictEqual(paginator.getNextOffset(), 5)
		paginator.offset = 10
		assert.strictEqual(paginator.getNextOffset(), 15)
		paginator.offset = 15
		assert.strictEqual(paginator.getNextOffset(), 15)
		paginator._limit = 4
		assert.strictEqual(paginator.getNextOffset(), 16)
		paginator._items = [1, 2, 3]
		assert.strictEqual(paginator.getNextOffset(), 0)
	})

	it("getOffsetByPage", () => {
		const paginator = new Paginator(3)
		assert.strictEqual(paginator.getOffsetByPage(1), 0)
		assert.strictEqual(paginator.getOffsetByPage(2), 3)
		assert.strictEqual(paginator.getOffsetByPage(3), 6)
		paginator._limit = 4
		assert.strictEqual(paginator.getOffsetByPage(1), 0)
		assert.strictEqual(paginator.getOffsetByPage(2), 4)
		assert.strictEqual(paginator.getOffsetByPage(3), 8)
	})

	it("getPageByOffset", () => {
		const paginator = new Paginator(3)
		assert.strictEqual(paginator.getPageByOffset(0), 1)
		assert.strictEqual(paginator.getPageByOffset(3), 2)
		assert.strictEqual(paginator.getPageByOffset(6), 3)
		paginator._limit = 4
		assert.strictEqual(paginator.getPageByOffset(0), 1)
		assert.strictEqual(paginator.getPageByOffset(4), 2)
		assert.strictEqual(paginator.getPageByOffset(8), 3)
	})

	it("getMaximumPage", () => {
		const paginator = new Paginator(3)
		paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
		assert.strictEqual(paginator.getMaximumPage(), 3)
		paginator._items = [1, 2, 3]
		assert.strictEqual(paginator.getMaximumPage(), 1)
		paginator._items = [1, 2]
		assert.strictEqual(paginator.getMaximumPage(), 1)
		paginator._items = [1, 2, 4, 5]
		assert.strictEqual(paginator.getMaximumPage(), 2)
	})

	it("getCurrentPage", () => {
		const paginator = new Paginator(3)
		paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
		assert.strictEqual(paginator.getCurrentPage(), 1)
		paginator.offset = 3
		assert.strictEqual(paginator.getCurrentPage(), 2)
		paginator.offset = 6
		assert.strictEqual(paginator.getCurrentPage(), 3)
		paginator._limit = 4
		assert.strictEqual(paginator.getCurrentPage(), 2)
		paginator._limit = 5
		assert.strictEqual(paginator.getCurrentPage(), 2)
	})

	it("getCurrentItems", () => {
		const paginator = new Paginator(3)
		paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
		assert.strictEqual(paginator.getCurrentItems().length, 3)
		assert.strictEqual(paginator.getCurrentItems()[0], 1)
		assert.strictEqual(paginator.getCurrentItems()[1], 2)
		assert.strictEqual(paginator.getCurrentItems()[2], 3)
		paginator.offset = 1
		assert.strictEqual(paginator.getCurrentItems().length, 3)
		assert.strictEqual(paginator.getCurrentItems()[0], 2)
		assert.strictEqual(paginator.getCurrentItems()[1], 3)
		assert.strictEqual(paginator.getCurrentItems()[2], 4)
		paginator._items = [1, 2 ,3]
		assert.strictEqual(paginator.getCurrentItems().length, 2)
		assert.strictEqual(paginator.getCurrentItems()[0], 2)
		assert.strictEqual(paginator.getCurrentItems()[1], 3)
	})

	it("getNextItems", () => {
		const paginator = new Paginator(3)
		paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
		assert.strictEqual(paginator.getNextItems().length, 3)
		assert.strictEqual(paginator.getNextItems()[0], 4)
		assert.strictEqual(paginator.getNextItems()[1], 5)
		assert.strictEqual(paginator.getNextItems()[2], 6)
		paginator.offset = 1
		assert.strictEqual(paginator.getNextItems().length, 3)
		assert.strictEqual(paginator.getNextItems()[0], 5)
		assert.strictEqual(paginator.getNextItems()[1], 6)
		assert.strictEqual(paginator.getNextItems()[2], 7)
		paginator._items = [1, 2, 3, 4]
		assert.strictEqual(paginator.getNextItems().length, 1)
		assert.strictEqual(paginator.getNextItems()[0], 4)
	})

	it("getPreviousItems", () => {
		const paginator = new Paginator(3)
		paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
		assert.strictEqual(paginator.getPreviousItems().length, 3)
		assert.strictEqual(paginator.getPreviousItems()[0], 1)
		assert.strictEqual(paginator.getPreviousItems()[1], 2)
		assert.strictEqual(paginator.getPreviousItems()[2], 3)
		paginator.offset = 1
		assert.strictEqual(paginator.getPreviousItems().length, 3)
		assert.strictEqual(paginator.getPreviousItems()[0], 1)
		assert.strictEqual(paginator.getPreviousItems()[1], 2)
		assert.strictEqual(paginator.getPreviousItems()[2], 3)
		paginator._items = [1, 2, 3, 4]
		assert.strictEqual(paginator.getPreviousItems().length, 3)
		assert.strictEqual(paginator.getPreviousItems()[0], 1)
		assert.strictEqual(paginator.getPreviousItems()[1], 2)
		assert.strictEqual(paginator.getPreviousItems()[2], 3)
		paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
		paginator.offset = 6
		assert.strictEqual(paginator.getPreviousItems().length, 3)
		assert.strictEqual(paginator.getPreviousItems()[0], 4)
		assert.strictEqual(paginator.getPreviousItems()[1], 5)
		assert.strictEqual(paginator.getPreviousItems()[2], 6)
	})

	it("getItemsByOffset", () => {
		const paginator = new Paginator(3)
		paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
		assert.strictEqual(paginator.getItemsByOffset(0).length, 3)
		assert.strictEqual(paginator.getItemsByOffset(0)[0], 1)
		assert.strictEqual(paginator.getItemsByOffset(0)[1], 2)
		assert.strictEqual(paginator.getItemsByOffset(0)[2], 3)
		assert.strictEqual(paginator.getItemsByOffset(1).length, 3)
		assert.strictEqual(paginator.getItemsByOffset(1)[0], 2)
		assert.strictEqual(paginator.getItemsByOffset(1)[1], 3)
		assert.strictEqual(paginator.getItemsByOffset(1)[2], 4)
		paginator._items = [1, 2 ,3]
		assert.strictEqual(paginator.getItemsByOffset(1).length, 2)
		assert.strictEqual(paginator.getItemsByOffset(1)[0], 2)
		assert.strictEqual(paginator.getItemsByOffset(1)[1], 3)
	})

})
