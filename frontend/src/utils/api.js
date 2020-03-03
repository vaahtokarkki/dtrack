import axios from 'axios'

import config from './settings'

const api = axios.create({
    baseURL: config.apiUrl
})

export default api;