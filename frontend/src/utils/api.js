import axios from 'axios'
import Qs from 'qs'

import config from './settings'

const api = axios.create({
    baseURL: config.apiUrl,
    paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
    },
})

export default api;