import { observable, action, runInAction, makeAutoObservable} from 'mobx'
import { config, Input, Model, timeout } from 'mobx-orm'


export enum ModelFormAction {
    SAVE = 1,
    DELETE = 2,
}

// DON'T extended the ModelFrom class
// it's MobX limitation, observable would not work in the super class
export class ModelForm<T extends Model> {
    readonly    inputs      : { [key: string]: Input<any> } = {}
    private     obj         : T
    readonly    action      : ModelFormAction
    readonly    onSuccess   : () => any
    readonly    onError     : () => any
    @observable isLoading   : boolean = false
    @observable errors      : string[] = []

    constructor(action?: ModelFormAction, onSuccess?:() => any, onError?: () => any) {
        this.action = action ? action : ModelFormAction.SAVE
        this.onSuccess = onSuccess
        this.onError = onError
        makeAutoObservable(this)
    }

    destroy() {
        for (const key in this.inputs) {
            this.inputs[key].destroy()
        }
    }

    setObj(obj: T) {
        this.obj = obj
        for (const key in this.inputs) {
            if (this.obj[key] !== undefined) {
                // set the input value from obj
                this.inputs[key].value = this.obj[key]
            }
            else {
                // clear the input
                this.inputs[key].setFromString('')
            }
        }
    }
    getObj() {
        return this.obj
    }

    get isReady(): boolean {
        return Object.values(this.inputs).every(input => input.isReady)
    }

    @action
    async submit() {
        if (!this.isReady) return   // just ignore

        runInAction(() => {
            this.isLoading = true
            this.errors = []
            // move values from inputs to obj
            for(const key in this.inputs) {
                this.obj[key] = this.inputs[key].value
            }
        })

        try {
            await timeout(2000)
            this.action === ModelFormAction.SAVE
                ? await this.obj.save()
                : await this.obj.delete() 
            this.onSuccess && this.onSuccess()
        }
        catch (err) {
            // handle errors
            for (const key in err.message) {
                if (key === config.NON_FIELD_ERRORS_KEY) {
                    this.errors = err.message[key]
                } else {
                    if (this.inputs[key])
                        this.inputs[key].errors = err.message[key]
                    else 
                        throw err
                }
            }
            this.onError && this.onError()
        }
        finally {
            runInAction(() => this.isLoading = false)
        }
    }
}
