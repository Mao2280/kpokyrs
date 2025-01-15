import { Model, model, field } from 'mobx-orm'
import { api } from '@/services/http-adapter'
import { Child } from './child'


@api('employee')
@model
export class Employee extends Model {
    @field fisrt_name ?: string
    @field patronymic ?: string
    @field last_name  ?: string

    readonly children: Child[]

    fio(): string {
        return `${this.last_name} ${this.fisrt_name} ${this.patronymic}`
    }
}

