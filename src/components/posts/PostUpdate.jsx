import React, { useEffect, useState } from 'react'
import { Link ,useNavigate, useParams} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import requestApi from '../../helpers/api'
import { toast } from 'react-toastify'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const PostUpdate = () => {
    const params = useParams().id
    const dispatch = useDispatch()
    const { register, setValue, trigger, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const [thumbnail, setThumbnail ] = useState('')
    const [category , setCategory] = useState([])
    const [post,setPost] = useState({})
    const handleSubmitFormAdd = (data) => {
        let formData = new FormData()
        console.log(data)
        for(let key in data) {
            if(key == 'thumbnail') {
                if (data.thumbnail[0] instanceof File) {
                    formData.append(key, data[key][0])
                }
            } else {
                formData.append(key,data[key])
            }
        }
        
        
        dispatch(actions.controlLoading(true))
        requestApi(`posts/${params}`,'PUT',formData,'json','multipart/form-data')
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

    function uploadPlugin( editor ) {
        editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
            // Configure the URL to the upload script in your backend here!
            return new CustomUploadAdapter( loader );
        };
    }

    useEffect(() => {
        dispatch(actions.controlLoading(true))
        requestApi('category','GET',[])
        .then(res => {
            dispatch(actions.controlLoading(false))
            setCategory(res.data)
        })
        .catch(errors => {
            console.log(errors)
            dispatch(actions.controlLoading(false))
        })

        requestApi(`posts/${params}`,'GET',[])
        .then(res => {
            dispatch(actions.controlLoading(false))
            console.log(res.data)
            const fields = ['title','description','summary','status','thumbnail','category']
            fields.forEach((field) => {
                if(field == 'category') {
                    setValue(field, res.data[field].id)
                } else {
                    setValue(field, res.data[field])
                }
            })
            setPost({...res.data})
        })
        .catch(error => {
            dispatch(actions.controlLoading(false))
            console.log(error)
        })
    },[])

    return (
        <div id="layoutSidenav_content">
            <main>
                <div className='container-fluid px-4'>
                    <h1 className='mt-4'>Update post</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item'><Link to='/'>Dashboard</Link></li>
                        <li className='breadcrumb-item'><Link to='/posts'>Posts</Link></li>
                        <li className='breadcrumb-item active'>Update Post</li>
                    </ol>
                    <div className='card mb-4'>
                        <div className='card-header'>
                            <i className='fas fa-plus me-1'></i>
                            Update
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
                                        data={post.description}
                                        onReady={editor => {
                                            register('description',{required:'Description is requied'})
                                        }}
                                        onChange={(event,editor) => {
                                            const data = editor.getData()
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
                                    <img src={thumbnail ? thumbnail : `${import.meta.env.VITE_API_URL}/${post.thumbnail}` } alt="..." className='mb-3' width={200} height={200} />
                                    <div className='input-file'>
                                        <label htmlFor="file" className='btn-file btn-sm btn btn-primary'>Browse File</label>
                                        <input type="file" id='file' name='thumbnail' {...register("thumbnail",{onChange: onThumbnailChange})}  accept='imgae/*' />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <select
                                        {...register('category')}
                                        type="text"
                                        className="form-select"
                                        placeholder='Enter Category'
                                        
                                    >
                                        <option value=''>Select option</option>
                                        {category.map((item,index) => {
                                            return (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            )
                                        })}
                                    </select>
                                    {errors.category && <small className="text-danger">{errors.category.message}</small>}
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

export default PostUpdate
