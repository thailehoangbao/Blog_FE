import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import requestApi from '../../helpers/api'
import * as actions from '../../redux/actions'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const UserUpdate = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const param = useParams().id
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()
    
    useEffect(() => {
        dispatch(actions.controlLoading(true))
        requestApi(`user/${param}`,'GET',[])
            .then(res => {
                dispatch(actions.controlLoading(false))
                const fields = ['first_name','last_name','status']
                fields.forEach((field) => setValue(field, res.data[field]))
            })
            .catch(error => {
                dispatch(actions.controlLoading(false))
                toast.error('Có lỗi xãy ra', {position: 'bottom-right'})
            })
    },[])

    const handleSubmitFormUpdate = async (data) => {
        try {
            dispatch(actions.controlLoading(true))
            const res = await requestApi(`user/${param}`,'PUT',data)
            dispatch(actions.controlLoading(false))
            toast.success('Update thành công', {position: 'bottom-right', autoClose: 2000})
            navigate('/users')   
        } catch (error) {
            dispatch(actions.controlLoading(false))
            toast.error('Có lỗi xãy ra', {position: 'bottom-right', autoClose: 2000})   
        }
    } 

    return (
    <div id="layoutSidenav_content">
        <main>
            <div className='container-fluid px-4'>
                <h1 className='mt-4'>Update User</h1>
                <ol className='breadcrumb mb-4'>
                    <li className='breadcrumb-item'><Link to='/'>Dashboard</Link></li>
                    <li className='breadcrumb-item'><Link to='/users'>Users</Link></li>
                    <li className='breadcrumb-item active'>Update</li>
                </ol>
                <div className='card mb-4'>
                    <div className='card-header'>
                        <i className='fas fa-plus me-1'></i>
                        Update
                    </div>
                    <div className='card-body'>
                        <form onSubmit={handleSubmit(handleSubmitFormUpdate)}>
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

export default UserUpdate