import { Observable } from "domodel"

import Paginator from "../src/object/paginator.js"

export function instance(test) {
	test.expect(4)
	const paginator = new Paginator(5)
	test.ok(paginator instanceof Observable)
	test.ok(Array.isArray(paginator._items))
	test.strictEqual(paginator._limit, 5)
	test.strictEqual(paginator._offset, 0)
	test.done()
}

export function getMaximumOffset(test) {
	test.expect(4)
	const paginator = new Paginator(3)
	paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
	test.strictEqual(paginator.getMaximumOffset(), 6)
	paginator._limit = 1
	test.strictEqual(paginator.getMaximumOffset(), 7)
	paginator._limit = 3
	paginator._items = [1, 2, 3, 4]
	test.strictEqual(paginator.getMaximumOffset(), 3)
	paginator._limit = 2
	test.strictEqual(paginator.getMaximumOffset(), 2)
	test.done()
}

export function getNearestOffset(test) {
	test.expect(8)
	const paginator = new Paginator(3)
	test.strictEqual(paginator.getNearestOffset(2), 3)
	test.strictEqual(paginator.getNearestOffset(3), 3)
	test.strictEqual(paginator.getNearestOffset(0), 0)
	test.strictEqual(paginator.getNearestOffset(4), 6)
	test.strictEqual(paginator.getNearestOffset(6), 6)
	paginator._limit = 2
	test.strictEqual(paginator.getNearestOffset(0), 0)
	test.strictEqual(paginator.getNearestOffset(2), 2)
	test.strictEqual(paginator.getNearestOffset(3), 4)
	test.done()
}

export function getPreviousOffset(test) {
	test.expect(4)
	const paginator = new Paginator(5)
	paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
	test.strictEqual(paginator.getPreviousOffset(), 0)
	paginator.offset = 10
	test.strictEqual(paginator.getPreviousOffset(), 5)
	paginator.offset = 15
	test.strictEqual(paginator.getPreviousOffset(), 10)
	paginator._limit = 4
	test.strictEqual(paginator.getPreviousOffset(), 11)
	test.done()
}

export function getNextOffset(test) {
	test.expect(5)
	const paginator = new Paginator(5)
	const items =
	paginator._items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
	test.strictEqual(paginator.getNextOffset(), 5)
	paginator.offset = 10
	test.strictEqual(paginator.getNextOffset(), 15)
	paginator.offset = 15
	test.strictEqual(paginator.getNextOffset(), 15)
	paginator._limit = 4
	test.strictEqual(paginator.getNextOffset(), 16)
	paginator._items = [1, 2, 3]
	test.strictEqual(paginator.getNextOffset(), 0)
	test.done()
}

export function getOffsetByPage(test) {
	test.expect(6)
	const paginator = new Paginator(3)
	test.strictEqual(paginator.getOffsetByPage(1), 0)
	test.strictEqual(paginator.getOffsetByPage(2), 3)
	test.strictEqual(paginator.getOffsetByPage(3), 6)
	paginator._limit = 4
	test.strictEqual(paginator.getOffsetByPage(1), 0)
	test.strictEqual(paginator.getOffsetByPage(2), 4)
	test.strictEqual(paginator.getOffsetByPage(3), 8)
	test.done()
}

export function getPageByOffset(test) {
	test.expect(6)
	const paginator = new Paginator(3)
	test.strictEqual(paginator.getPageByOffset(0), 1)
	test.strictEqual(paginator.getPageByOffset(3), 2)
	test.strictEqual(paginator.getPageByOffset(6), 3)
	paginator._limit = 4
	test.strictEqual(paginator.getPageByOffset(0), 1)
	test.strictEqual(paginator.getPageByOffset(4), 2)
	test.strictEqual(paginator.getPageByOffset(8), 3)
	test.done()
}

export function getMaximumPage(test) {
	test.expect(4)
	const paginator = new Paginator(3)
	paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
	test.strictEqual(paginator.getMaximumPage(), 3)
	paginator._items = [1, 2, 3]
	test.strictEqual(paginator.getMaximumPage(), 1)
	paginator._items = [1, 2]
	test.strictEqual(paginator.getMaximumPage(), 1)
	paginator._items = [1, 2, 4, 5]
	test.strictEqual(paginator.getMaximumPage(), 2)
	test.done()
}

export function getCurrentPage(test) {
	test.expect(5)
	const paginator = new Paginator(3)
	paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
	test.strictEqual(paginator.getCurrentPage(), 1)
	paginator._offset = 3
	test.strictEqual(paginator.getCurrentPage(), 2)
	paginator._offset = 6
	test.strictEqual(paginator.getCurrentPage(), 3)
	paginator._limit = 4
	test.strictEqual(paginator.getCurrentPage(), 2)
	paginator._limit = 5
	test.strictEqual(paginator.getCurrentPage(), 2)
	test.done()
}

export function getCurrentItems(test) {
	test.expect(11)
	const paginator = new Paginator(3)
	paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
	test.strictEqual(paginator.getCurrentItems().length, 3)
	test.strictEqual(paginator.getCurrentItems()[0], 1)
	test.strictEqual(paginator.getCurrentItems()[1], 2)
	test.strictEqual(paginator.getCurrentItems()[2], 3)
	paginator.offset = 1
	test.strictEqual(paginator.getCurrentItems().length, 3)
	test.strictEqual(paginator.getCurrentItems()[0], 2)
	test.strictEqual(paginator.getCurrentItems()[1], 3)
	test.strictEqual(paginator.getCurrentItems()[2], 4)
	paginator._items = [1, 2 ,3]
	test.strictEqual(paginator.getCurrentItems().length, 2)
	test.strictEqual(paginator.getCurrentItems()[0], 2)
	test.strictEqual(paginator.getCurrentItems()[1], 3)
	test.done()
}

export function getNextItems(test) {
	test.expect(10)
	const paginator = new Paginator(3)
	paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
	test.strictEqual(paginator.getNextItems().length, 3)
	test.strictEqual(paginator.getNextItems()[0], 4)
	test.strictEqual(paginator.getNextItems()[1], 5)
	test.strictEqual(paginator.getNextItems()[2], 6)
	paginator.offset = 1
	test.strictEqual(paginator.getNextItems().length, 3)
	test.strictEqual(paginator.getNextItems()[0], 5)
	test.strictEqual(paginator.getNextItems()[1], 6)
	test.strictEqual(paginator.getNextItems()[2], 7)
	paginator._items = [1, 2, 3, 4]
	test.strictEqual(paginator.getNextItems().length, 1)
	test.strictEqual(paginator.getNextItems()[0], 4)
	test.done()
}

export function getPreviousItems(test) {
	test.expect(16)
	const paginator = new Paginator(3)
	paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
	test.strictEqual(paginator.getPreviousItems().length, 3)
	test.strictEqual(paginator.getPreviousItems()[0], 1)
	test.strictEqual(paginator.getPreviousItems()[1], 2)
	test.strictEqual(paginator.getPreviousItems()[2], 3)
	paginator.offset = 1
	test.strictEqual(paginator.getPreviousItems().length, 3)
	test.strictEqual(paginator.getPreviousItems()[0], 1)
	test.strictEqual(paginator.getPreviousItems()[1], 2)
	test.strictEqual(paginator.getPreviousItems()[2], 3)
	paginator._items = [1, 2, 3, 4]
	test.strictEqual(paginator.getPreviousItems().length, 3)
	test.strictEqual(paginator.getPreviousItems()[0], 1)
	test.strictEqual(paginator.getPreviousItems()[1], 2)
	test.strictEqual(paginator.getPreviousItems()[2], 3)
	paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
	paginator.offset = 6
	test.strictEqual(paginator.getPreviousItems().length, 3)
	test.strictEqual(paginator.getPreviousItems()[0], 4)
	test.strictEqual(paginator.getPreviousItems()[1], 5)
	test.strictEqual(paginator.getPreviousItems()[2], 6)
	test.done()
}

export function getItemsByOffset(test) {
	test.expect(11)
	const paginator = new Paginator(3)
	paginator._items = [1, 2, 3, 4, 5, 6, 7, 8]
	test.strictEqual(paginator.getItemsByOffset(0).length, 3)
	test.strictEqual(paginator.getItemsByOffset(0)[0], 1)
	test.strictEqual(paginator.getItemsByOffset(0)[1], 2)
	test.strictEqual(paginator.getItemsByOffset(0)[2], 3)
	test.strictEqual(paginator.getItemsByOffset(1).length, 3)
	test.strictEqual(paginator.getItemsByOffset(1)[0], 2)
	test.strictEqual(paginator.getItemsByOffset(1)[1], 3)
	test.strictEqual(paginator.getItemsByOffset(1)[2], 4)
	paginator._items = [1, 2 ,3]
	test.strictEqual(paginator.getItemsByOffset(1).length, 2)
	test.strictEqual(paginator.getItemsByOffset(1)[0], 2)
	test.strictEqual(paginator.getItemsByOffset(1)[1], 3)
	test.done()
}
