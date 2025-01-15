import axios from 'axios'

axios.defaults.xsrfHeaderName   = 'X-CSRFToken'
axios.defaults.xsrfCookieName   = 'csrftoken'
axios.defaults.withXSRFToken    = true
axios.defaults.withCredentials  = true
axios.defaults.baseURL          = `http://main.${window.location.hostname}/api`

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401
        || (error.response.status === 403 && error.response.data.detail === "Authentication credentials were not provided.")) {
            window.location.href = `http://main.${window.location.hostname}/auth/login/`
        }
        return Promise.reject(error)
    }
)
const http = axios
export default http
