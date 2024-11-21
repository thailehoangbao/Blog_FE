import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'
import requestApi from '../helpers/api'
import { toast } from 'react-toastify'

const Profile = () => {
    const [profileData,setProfileData] = useState({})
    const [isSelectedFile, setIsSelectedFile] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(actions.controlLoading(true))
        const requestProfileApi = async () => {
            try {
                const res = await requestApi(`user/profile`,'GET')
                dispatch(actions.controlLoading(false))
                console.log(res)
                setProfileData({...res.data,avatar: import.meta.env.VITE_API_URL + '/' + res.data.avatar})
            } catch (error) {
                dispatch(actions.controlLoading(false))
                console.log(error)
            }
        }
        requestProfileApi()
    },[])

    const onImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0]
            let reader = new FileReader()
            reader.onload = (e) => {
                setProfileData({
                    ...profileData, avatar: reader.result, file: file
                })
                setIsSelectedFile(true)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUpdateAvatar = () => {
        let formData = new FormData()
        formData.append('avatar', profileData.file)
        dispatch(actions.controlLoading(true))
        requestApi(`user/upload-avatar`,'POST',formData, 'json','multipart/form-data')
        .then(res => {
            dispatch(actions.controlLoading(false))
            console.log(res)
            toast.success('Upload Avatar thành công', { position: 'top-center', autoClose: 2000 })
        })
        .catch(error => {
            dispatch(actions.controlLoading(false))
            console.log(error)
            toast.error('Upload Avatar thất bại', { position: 'top-center', autoClose: 2000 })
        })

    }
    return (
        <div id="layoutSidenav_content">
            <main>
                <div className='container-fluid px-4'>
                    <h1 className='mt-4'>Profile</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item'><Link to='/'>Dashboard</Link></li>
                        <li className='breadcrumb-item active'>Update avatar</li>
                    </ol>
                    <div className='card mb-4'>
                        <div className='card-body'>
                            <div className='row mb-3'>
                                <div className='col-md-4'>
                                    <img src={profileData ? `${profileData.avatar}` : '../../public/assets/images/avatar-default.png'} className='img-thumbnail rounded mb-2' alt="..." width={300} height={300}/>
                                    <div className='input-file'>
                                        <label htmlFor="file" className='btn-file btn btn-primary mx-2'>Browse Files</label>
                                        <input type="file" id='file' accept='images/*' onChange={onImageChange}/>
                                        {isSelectedFile && (
                                            <button className='btn btn-sm btn-success float-end' onClick={handleUpdateAvatar}>Update</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Profile