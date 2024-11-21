import requestApi from "./api"

export default class CustomUploadAdapter {
    constructor(loader) {
        this.loader = loader
    }

    upload = () => {
        return this.loader.file.then(file => new Promise((resolve,reject)=> {
            // upload image to server
            const formData = new FormData()
            formData.append('upload',file)
            requestApi('posts/cke-upload','POST',formData,'json','multipart/form-data')
            .then(res =>  {
                resolve({
                    default: `${import.meta.env.VITE_API_URL}/uploads/${res.data.url}`
                })
            }).catch(error => {
                reject(error)
            })
        }))
    }
}