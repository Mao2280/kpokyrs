/* eslint react-hooks/exhaustive-deps: 0 */ 
import { useMemo, useEffect } from 'react'
import { Model, QueryProps, InputConstructorArgs, ObjectInputConstructorArgs, ObjectForm, Input } from 'mobx-orm'
import { ModelForm } from './form'

/**
 *  Hooks for uging mobx-orm inputs and queries
 */


enum QueryType {
    QUERY           = 'getQuery',
    QUERY_PAGE      = 'getQueryPage',
    QUERY_RAW       = 'getQueryRaw',
    QUERY_RAW_PAGE  = 'getQueryRawPage'
}
const makeQuery = <M extends typeof Model>(model: M, queryType: QueryType, options?: QueryProps<InstanceType<M>>) => {
    const query = useMemo(() => model[queryType](options), [])
    const ready = useMemo(() => query.ready(), [])  // invoke at FIRST time query loaded
    useEffect(() => () => query.destroy(), [])
    return [query, ready]
}
export const useQuery = <M extends typeof Model>(model: M, options?: QueryProps<InstanceType<M>>) => {
    return makeQuery(model, QueryType.QUERY, options)
}
export const useQueryPage = <M extends typeof Model>(model: M, options?: QueryProps<InstanceType<M>>) => {
    return makeQuery(model, QueryType.QUERY_PAGE, options)
}
export const useQueryRaw = <M extends typeof Model>(model: M, options?: QueryProps<InstanceType<M>>) => {
    return makeQuery(model, QueryType.QUERY_RAW, options)
}
export const useQueryRawPage = <M extends typeof Model>(model: M, options?: QueryProps<InstanceType<M>>) => {
    return makeQuery(model, QueryType.QUERY_RAW_PAGE, options)
}

export const useInput = <T>(
    InputConstructor: (args?: InputConstructorArgs<T>) => Input<T>,
    options?: InputConstructorArgs<T>,
    reset?: Boolean
) => {
    const input = useMemo(() => InputConstructor(options), [])
    useEffect(() => {
        return () => {
            if (reset) input.set(undefined)
            input.destroy()
        }
    } , [])
    return input
}

export const useObjectInput = (
    InputConstructor: any,
    options: ObjectInputConstructorArgs<any, any>,
    reset?: Boolean
) => {
    const input = useMemo(() => new InputConstructor(options), [])
    useEffect(() => {
        return () => {
            if (reset) input.set(undefined)
            input.destroy()
        }
    } , [])
    return input
}

export const useModelForm = <T extends Model> (builder: ()=> ModelForm<T>) => {
    const form = useMemo(builder, [])
    useEffect(() => {
        return () => form.destroy()
    } , [])
    return form
}

