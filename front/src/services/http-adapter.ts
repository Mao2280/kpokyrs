import { Model, Adapter, Query, Filter, Repository, timeout } from 'mobx-orm'

import http from './http'


export class HttpAdapter<M extends Model> extends Adapter<M> {
    readonly endpoint: string

    constructor (endpoint?: string) {
        super()
        this.endpoint = endpoint + '/'
    }

    async action (obj_id: number, name: string, kwargs: any): Promise<any> {
        const data = new FormData()
        for (const key in kwargs) {
            if (Object.prototype.hasOwnProperty.call(kwargs, key)) {
                const value = kwargs[key]
                if (value !== null && typeof value === 'object' && !(value instanceof File)) {
                    data.append(key, JSON.stringify(value))
                } else {
                    data.append(key, value)
                }
            }
        }
        const response = await http.post(`${this.endpoint}${obj_id}/${name}/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    }

    async create (obj: any): Promise<any> {
        const data = new FormData()
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key]
                if (value !== null && typeof value === 'object' && !(value instanceof File)) {
                    data.append(key, JSON.stringify(value))
                } else {
                    data.append(key, value)
                }
            }
        }

        const response = await http.post(this.endpoint, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    }

    async update (obj_id: number, only_changed_raw_data: any): Promise<any> {
        const data = new FormData()
        for (const key in only_changed_raw_data) {
            if (Object.prototype.hasOwnProperty.call(only_changed_raw_data, key)) {
                const value = only_changed_raw_data[key]
                if (value !== null && typeof value === 'object' && !(value instanceof File)) {
                    data.append(key, JSON.stringify(value))
                } else {
                    data.append(key, value)
                }
            }
        }
        if (![...data].length) {
            return {}
        }
        const response = await http.patch(`${this.endpoint}${obj_id}/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    }

    async delete (obj_id: number): Promise<void> {
        await http.delete(`${this.endpoint}${obj_id}/`)
    }

    async get (obj_id: number): Promise<any> {
        const raw_obj = await http.get(`${this.endpoint}${obj_id}/`)
        return raw_obj.data
    }

    async find (): Promise<any> {
        const raw_obj = await http.get(this.endpoint) 
        return raw_obj
    }

    async load (query, controller?): Promise<any[]> {
        let queryParams = this.getURLSearchParams(query)
        const response: any = await http.get(
            this.endpoint + `?${queryParams.toString()}`,
            { signal: controller?.signal },
        )
        // await timeout(2000) 
        return response.data
    }

    async getTotalCount (where?, controller?): Promise<number> {
        const response = await http.get(
            this.endpoint + 'count/' + (where ? `?${where.URLSearchParams.toString()}` : ''),
            { signal: controller?.signal },
        )
        return response.data
    }

    async getDistinct (filter: Filter, field: string, controller?): Promise<any[]> {
        const searchParams = filter ? filter.URLSearchParams : new URLSearchParams()
        searchParams.set('__distinct', field)
        const response = await http.get(
            `${this.endpoint}distinct/?${searchParams.toString()}`,
            { signal: controller?.signal },
        )
        return response.data
    }

    getURLSearchParams(query: Query<M>): URLSearchParams {
        const searchParams = query.filter ? query.filter.URLSearchParams : new URLSearchParams()
        if (query.orderBy?.value?.size      ) searchParams.set('__order_by' , query.orderBy.toString())
        if (query.limit.value !== undefined ) searchParams.set('__limit'    , query.limit.toString())
        if (query.offset.value !== undefined) searchParams.set('__offset'   , query.offset.toString())
        if (query.relations.value.length    ) searchParams.set('__relations', query.relations.toString())
        if (query.fields.value.length       ) searchParams.set('__fields'   , query.fields.toString())
        if (query.omit.value.length         ) searchParams.set('__omit'     , query.omit.toString())
        return searchParams
    }
}

// model decorator
export function api (endpoint: string) {
    return (cls: any) => {
        let repository = new Repository(cls, new HttpAdapter(endpoint)) 
        cls.__proto__.repository = repository
    }
}

// export const getFullFilter = (selector: Selector): URLSearchParams => {
//     const queryParams = selector.filter ? selector.filter.URLSearchParams : new URLSearchParams()
//     const order_by = [] // eslint-disable-line @typescript-eslint/naming-convention
//     for (const field of selector.order_by.keys()) {
//         const value = selector.order_by.get(field)
//         // eslint-disable-next-line @typescript-eslint/naming-convention
//         const _field = field.replace(/\./g, '__')
//         order_by.push(value === ASC ? `${_field}` : `-${_field}`)
//     }
//     if (order_by.length) queryParams.set('__order_by', order_by.join())
//     if (selector.limit !== undefined) queryParams.set('__limit', selector.limit as any)
//     if (selector.offset !== undefined) queryParams.set('__offset', selector.offset as any)
//     if (selector.relations?.length) queryParams.set('__relations', selector.relations as any)
//     if (selector.fields?.length) queryParams.set('__fields', selector.fields as any)
//     if (selector.omit?.length) queryParams.set('__omit', selector.omit as any)
//     return queryParams
// }
