# domodel-paginator [![Build Status](https://travis-ci.com/thoughtsunificator/domodel-paginator.svg?branch=master)](https://travis-ci.com/thoughtsunificator/domodel-paginator)

Pagination system for [domodel](https://github.com/thoughtsunificator/domodel).

## Getting started

### Installing

``npm install @domodel/paginator``

### Usage

```javascript
import { Core, Binding } from "domodel"
import { Paginator, PaginatorModel, PaginatorBinding, ItemBinding } from "@domodel/paginator"
import FruitModel from "/model/fruit.js"

export default class extends Binding {

	onCreated() {
		const paginator = new Paginator(5)

		Core.run(PaginatorModel, {
			parentNode: this.root,
			binding: new PaginatorBinding({ paginator })
		})

		paginator.emit("items set", [
			{
				model: FruitModel,
				binding: new ItemBinding(),
				properties: { name: "Red" }
			},
			{
				model: FruitModel,
				binding: new ItemBinding(),
				properties: { name: "Pink" }
			},
			{
				model: FruitModel,
				binding: new ItemBinding(),
				properties: { name: "Green" }
			}
		])
	}

}
```
