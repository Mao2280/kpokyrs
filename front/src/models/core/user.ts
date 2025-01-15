import { Model, model, field } from 'mobx-orm'
import { api } from '@/services/http-adapter'


@api('user')
@model
export class User extends Model {
    @field username     ?: string
    @field first_name   ?: string
    @field last_name    ?: string

    get fullName (): string {
        return [this?.first_name, this?.last_name].filter(el => Boolean(el)).join(' ')
    }
}
