import { makeObservable, observable, runInAction } from 'mobx'
import { waitIsTrue } from 'mobx-orm'
import http from './http'

const ORG_USER_ID = 'org-user-id'

class Me {
    // NOTE: there are no observable fields
    // because they initialized once and never changed except is_ready
    @observable is_ready = false
    @observable error    = undefined 

    @observable user_id                 ?: number | null = undefined  // null - is anonymous user
    @observable org_user_id             ?: number | null = undefined  // null - no org_user_id
    @observable available_org_user_ids   : number[] = []
    @observable is_staff                 : boolean = false

    get isAuthenticated () { return this.user_id !== null && this.user_id !== undefined }

    ready = async () => waitIsTrue(this, 'is_ready')

    constructor () {
        makeObservable(this)
    }

    async init () {
        try {
            const response = await http.get('me/')
            runInAction(() => {
                this.user_id = response.data.user_id
                this.is_staff = response.data.is_staff
                // if (this.user_id) {
                //     this.org_user_id = JSON.parse(localStorage.getItem(ORG_USER_ID) as string)
                //     this.available_org_user_ids = response.data.available_org_user_ids
                //     // this.available_org_user_ids = [1, 2, 3]
                //     if (this.org_user_id) {
                //         // if org_user_id is not in available_org_user_ids - reset org_user_id
                //         if (!this.available_org_user_ids.includes(this.org_user_id)) {
                //             this.org_user_id = null
                //             localStorage.removeItem(ORG_USER_ID)
                //         }
                //     }
                //     // if the user has available_org_user_ids - set first org_user_id as default 
                //     else if (this.available_org_user_ids.length > 0) {
                //         this.org_user_id = this.available_org_user_ids[0]
                //         localStorage.setItem(ORG_USER_ID, `${this.org_user_id}`)
                //     }
                //     if (this.org_user_id) {
                //         http.defaults.headers.common[ORG_USER_ID] = this.org_user_id
                //     }
                // }
            })

        }
        catch (e) {
            runInAction(() => this.error = e.message)
            console.error(e)
        }
        finally {
            runInAction(() => this.is_ready = true )
        }
    }

    logout () {
        window.location.href = `${window.location.protocol}//main.${window.location.hostname}/auth/logout/`
    }

    shoudBeAuthenticated () {
        if (!this.isAuthenticated) {
            // TODO: don't use constant path, use settings
            window.location.href = `${window.location.protocol}//main.${window.location.hostname}/auth/login/`
        }
    }

    async login (username: string, password: string) {
        await http.post('/token/', { username, password })
    }
}

const me = new Me()
export default me
