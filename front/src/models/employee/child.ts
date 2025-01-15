import { Model, model, field, foreign, many } from 'mobx-orm'
import { api } from '@/services/http-adapter'
import { Employee } from './employee'


@api('child')
@model
export class Child extends Model {
    @field fisrt_name ?: string
    @field patronymic ?: string
    @field last_name  ?: string
    @field birthday   ?: string
    @field parent_id  ?: number

    @foreign(Employee) parent : Employee
}
many(Child, 'parent_id')(Employee, 'children')
