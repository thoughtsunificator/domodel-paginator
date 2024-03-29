# domodel-paginator

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

    this.run(PaginatorModel, {
      binding: new PaginatorBinding({ paginator })
    })

    paginator.emit("itemsSet", [
      {
        model: FruitModel,
        binding: ItemBinding,
        properties: { name: "Red" }
      },
      {
        model: FruitModel,
        binding: ItemBinding,
        properties: { name: "Pink" }
      },
      {
        model: FruitModel,
        binding: ItemBinding,
        properties: { name: "Green" }
      }
    ])
    
  }

}
```
