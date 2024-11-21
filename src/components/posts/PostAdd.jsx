import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import requestApi from '../../helpers/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CustomUploadAdapter from '../../helpers/CustomUploadAdapter'

const PostAdd = () => {
    const dispatch = useDispatch()
    const { register, setValue, trigger, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const [thumbnail, setThumbnail ] = useState('')
    const [category , setCategory] = useState([])
    const handleSubmitFormAdd = (data) => {
        let formData = new FormData()
        for(let key in data) {
            if(key == 'thumbnail') {
                formData.append(key, data[key][0])
            } else {
                formData.append(key,data[key])
            }
        }
        console.log(data)
        dispatch(actions.controlLoading(true))
        requestApi(`posts`,'POST',formData,'json','multipart/form-data')
        .then(res => {
            console.log(res)
            dispatch(actions.controlLoading(false))
            toast.success('Thêm post thành công',{position:'top-center', autoClose: 2000})
            navigate('/posts')
        })
        .catch(error => {
            toast.error(error.response.data.message, {position: 'top-center', autoClose: 2000})
            dispatch(actions.controlLoading(false))
        })
    }

    const onThumbnailChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            let reader = new FileReader()
            reader.onload = (e) => {
                setThumbnail(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        dispatch(actions.controlLoading(true))
        requestApi('category','GET',[])
        .then(res => {
            dispatch(actions.controlLoading(false))
            console.log(res)
            setCategory(res.data)
        })
        .catch(errors => {
            console.log(errors)
            dispatch(actions.controlLoading(false))

        })
    },[])

    function uploadPlugin( editor ) {
        editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
            // Configure the URL to the upload script in your backend here!
            return new CustomUploadAdapter( loader );
        };
    }

    return (
        <div id="layoutSidenav_content">
            <main>
                <div className='container-fluid px-4'>
                    <h1 className='mt-4'>New post</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item'><Link to='/'>Dashboard</Link></li>
                        <li className='breadcrumb-item'><Link to='/posts'>Posts</Link></li>
                        <li className='breadcrumb-item active'>Add New</li>
                    </ol>
                    <div className='card mb-4'>
                        <div className='card-header'>
                            <i className='fas fa-plus me-1'></i>
                            Add
                        </div>
                        <div className='card-body'>
                            <form onSubmit={handleSubmit(handleSubmitFormAdd)}>
                                <div className='col-md-6 mb-3'>
                                    <label htmlFor="" className='form-label'>Title</label>
                                    <input
                                        {...register('title', { required: 'Title is required' })}
                                        type="text"
                                        className='form-control'
                                        placeholder='Enter Title'
                                    />
                                    {errors.title && <small className="text-danger">{errors.title.message}</small>}
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label className='form-label'>Summary</label>
                                    <input
                                        {...register('summary', { required: 'Summary is required' })}
                                        type="text"
                                        className='form-control'
                                        placeholder='Enter Summary'
                                    />
                                    {errors.summary && <small className="text-danger">{errors.summary.message}</small>}
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label className='form-label'>Description</label>
                                    <CKEditor
                                        editor={ ClassicEditor }
                                        onReady={editor => {
                                            register('description',{required:'Description is requied'})
                                        }}
                                        onChange={(event,editor) => {
                                            const data = editor.getData()
                                            console.log(data)
                                            setValue('description', data)
                                            trigger('description')
                                        }}
                                        config={{ 
                                            extraPlugins: [uploadPlugin]
                                        }}
                                    />
                                    {errors.description && <small className="text-danger">{errors.description.message}</small>}

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="">Thumbnail</label>
                                    <br />
                                    {thumbnail ? (<img src={thumbnail} alt="..." className='mb-3' width={200} height={200} />) : ''}
                                    <div className='input-file'>
                                        <label htmlFor="file" className='btn-file btn-sm btn btn-primary'>Browse File</label>
                                        <input type="file" id='file' name='thumbnail' {...register("thumbnail",{required: "Thumbnail is required",onChange: onThumbnailChange})}  accept='imgae/*' />
                                    </div>
                                    {errors.thumbnail && <small className="text-danger">{errors.thumbnail.message}</small>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <select
                                        {...register('category', {
                                            required: 'Password is required'
                                        })}
                                        type="password"
                                        className="form-select"
                                        placeholder='Enter password'
                                    >
                                        <option value="">Select a category</option>
                                        {category.map((item,index) => {
                                            return (
                                                <option key={item.id}  value={item.id}>{item.name}</option>
                                            )
                                        })}

                                    </select>
                                    {errors.password && <small className="text-danger">{errors.password.message}</small>}
                                </div>
                                <div className='mt-3 mb-3'>
                                    <label className='form-label'>Status:</label>
                                    <select {...register('status')} className='form-select'>
                                        <option value="1">Active</option>
                                        <option value="2">Inactive</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PostAdd
