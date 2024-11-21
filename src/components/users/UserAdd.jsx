import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import requestApi from '../../helpers/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const UserAdd = () => {
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const handleSubmitFormAdd = (data) => {
        console.log(data)
        dispatch(actions.controlLoading(true))
        requestApi(`user/create`,'POST',data)
        .then(res => {
            console.log(res)
            dispatch(actions.controlLoading(false))
            toast.success('Thêm user thành công',{position:'top-center', autoClose: 2000})
            navigate('/users')
        })
        .catch(error => {
            toast.error(error.response.data.message, {position: 'top-center', autoClose: 2000})
            dispatch(actions.controlLoading(false))
        })
    }

    return (
        <div id="layoutSidenav_content">
            <main>
                <div className='container-fluid px-4'>
                    <h1 className='mt-4'>New User</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item'><Link to='/'>Dashboard</Link></li>
                        <li className='breadcrumb-item'><Link to='/users'>Users</Link></li>
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
                                    <label htmlFor="" className='form-label'>First Name</label>
                                    <input
                                        {...register('first_name', { required: 'First name is required' })}
                                        type="text"
                                        className='form-control'
                                        placeholder='Enter first name'
                                    />
                                    {errors.first_name && <small className="text-danger">{errors.first_name.message}</small>}
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <label className='form-label'>Last Name</label>
                                    <input
                                        {...register('last_name', { required: 'Last name is required' })}
                                        type="text"
                                        className='form-control'
                                        placeholder='Enter last name'
                                    />
                                    {errors.last_name && <small className="text-danger">{errors.last_name.message}</small>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email address</label>
                                    <input
                                        {...register('email', { 
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,4}$/,
                                                message: 'Invalid email'
                                            }
                                        })}
                                        type="email"
                                        className="form-control"
                                        placeholder='Enter email'
                                    />
                                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        {...register('password', {
                                            required: 'Password is required'
                                        })}
                                        type="password"
                                        className="form-control"
                                        placeholder='Enter password'
                                    />
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

export default UserAdd
