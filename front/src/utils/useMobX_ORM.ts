// useSyncWithExternalLib.js
import { useEffect } from 'react'
import { config } from 'mobx-orm'
import { useSearchParams, useLocation  } from 'react-router-dom'

const url_changed_callbacks = new Set()

/**
 * This hook is used to sync the MobX-ORM with the URL.
 */

const useMobX_ORM = () => {
    // const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    config.UPDATE_SEARCH_PARAMS = (search_params: URLSearchParams) => {
        // check if search_params is different from current searchParams
        if (search_params.toString() === searchParams.toString())
            return
        // console.log('UPDATE_SEARCH_PARAMS')
        // console.log(search_params.toString())
        // console.log(searchParams.toString())
        setSearchParams(search_params)
    }
    config.WATCTH_URL_CHANGES = (callback: (any) => any) => {
        url_changed_callbacks.add(callback)
        return () => { url_changed_callbacks.delete(callback) }
    }
    useEffect(() => {
        // TODO: we have a problem with url_changed_callbacks, it's not disposed
        // console.log('useEffect: location changed', url_changed_callbacks.size)
        url_changed_callbacks.forEach((callback:()=> any) => callback())
    }, [location])
}

export default useMobX_ORM
