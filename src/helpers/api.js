import axios from 'axios'

export default function requestApi(endpoint, method, body, responseType='json',contentType = 'application/json') {
    const headers = {
        "Accept": 'application/json',
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*"
    }

    const instance = axios.create({ headers });

    instance.interceptors.request.use(
        (configs) => {
            const token = localStorage.getItem('access_token')
            if (token) {
                configs.headers['Authorization'] = `Bearer ${token}`
            }
            return configs
        },
        (error) => {
            return Promise.reject(error)
        }
    );

    instance.interceptors.response.use(
        (response) => {
            return response
        },
        async(error) => {
            const ogirinalConfig = error.config
            console.log("Access token expired")
            if(error.response && error.response.status === 419) {
                try {
                    console.log("Call refresh roken api")
                    const result = await instance.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`,{
                        refresh_token: localStorage.getItem('refresh_token')
                    })
                    const {access_token,refresh_token} = result.data
                    localStorage.setItem('access_token',access_token)
                    localStorage.setItem('refresh_token',refresh_token)
                    ogirinalConfig.headers['Authorization'] = `Bearer ${access_token}`

                    return instance(ogirinalConfig)
                } catch(error) {
                    if(error.response && error.response.status === 400) {
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('refresh_token')
                        window.location.href = '/login'
                    }

                    return Promise.reject(error)
                }
            } 
            return Promise.reject(error)
        }
    )

    return instance.request({
        method: method,
        url: `${import.meta.env.VITE_API_URL}/${endpoint}`,
        data: body,
        responseType: responseType
    })
}  