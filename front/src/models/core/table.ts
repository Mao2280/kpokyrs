import { constant } from "@/services/constant-adapter"
import { field, Model, model } from "mobx-orm"


const PAGE_SIZE = [
    { id: 10  , label: '10'  },
    { id: 20  , label: '20'  },
    { id: 50  , label: '50'  },
    { id: 100 , label: '100' },
    { id: 500 , label: '500' },
    { id: 1000, label: '1000'},
]
@constant(PAGE_SIZE)
@model
export class PageSize extends Model {
    @field label: string
}
export const PageSizeOptions = PageSize.getQuery({autoupdate: true})
