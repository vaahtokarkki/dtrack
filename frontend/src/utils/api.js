import { create } from 'apisauce'

import config from './settings'

const tokens = {
    accessToken: null,
}

export const updateApiToken = token =>
    tokens.accessToken = token

const api = create({
    baseURL: config.apiUrl,
    headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
    },
    timeout: 30000
})

const monitor = (response) => {
    const { config: { method, url }, status } = response
    console.group(`Requesting [${method.toUpperCase()}] ${url}:`)
    console.log('Response Status:', status)
    console.groupEnd()
}
api.addMonitor(monitor)

api.addRequestTransform(request => {
    if (tokens.accessToken)
        request.headers['Authorization'] = `Bearer ${tokens.accessToken}`
})

export default api