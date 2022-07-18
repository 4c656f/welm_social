import axios from 'axios'

export const API_URL = "http://localhost:80"

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})



api.interceptors.request.use((config) => {

    config.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "access_token": localStorage.getItem("token")
    }


    return config
})

export default api;