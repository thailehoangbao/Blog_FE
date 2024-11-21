import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import requestApi from '../helpers/api';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { controlLoading } from '../redux/actions'

const Login = () => {
    const [loginData, setLoginData] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isSumit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    
    const onChange = (event) => {
        let target = event.target;
        setLoginData({
            ...loginData,[target.name]: target.value
        })
    }
    
    useEffect(() => {
        if(isSumit) {
            validateform()
        }
    },[loginData])

    const validateform = () => {
        let isValid = true;
        const errors = {};
        if (loginData.email === '' || loginData.email === undefined ) {
            errors.email = "Please enter email"
        } else {
            let valid = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,4}$/i.test(loginData.email)
            if(!valid) {
                errors.email = "Email is not valid"
            }
        }

        if (loginData.password === '' || loginData.password === undefined) {
            errors.password = "Please enter password"
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            isValid = false
        } else {
            setFormErrors({})
        }
        return isValid;
    }  


    const onSubmit = () => {
        let valid = validateform();
        if (valid) {
            dispatch(controlLoading(true))
            requestApi('auth/login','POST', loginData)
            .then((res) => {
                localStorage.setItem('access_token', res.data.access_token)
                localStorage.setItem('refresh_token', res.data.refresh_token)
                dispatch(controlLoading(false))
                navigate('/')
            })
            .catch(error => {
                dispatch(controlLoading(false))
                if (typeof error.response !== undefined ) {
                    if (error.response.statusCode !== 201) {
                        toast.error(error.response.data.message, {position: 'top-center'})
                    }
                } else {
                    toast.error("Server is down . Please try again")
                }
            })
        }

        setIsSubmit(true)
    }

    return (
        <div id="layoutAuthentication" className='bg-primary'>
        <div id="layoutAuthentication_content">
            <main>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card shadow-lg border-0 rounded-lg mt-5">
                                <div className="card-header"><h3 className="text-center font-weight-light my-4">Login</h3></div>
                                <div className="card-body">
                                    <form>
                                        <div className="form-floating mb-3">
                                            <input className="form-control" name='email' type="email" onChange={onChange} placeholder="name@example.com" />
                                            <label >Email address</label>
                                            <span style={{ color: 'red' }}>{formErrors.email ? formErrors.email : ''}</span>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input className="form-control" name='password' type="password" onChange={onChange} placeholder="Password" />
                                            <label >Password</label>
                                            <span style={{ color: 'red' }}>{formErrors.password ? formErrors.password : ''}</span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                            <a className="small" href="password.html">Forgot Password?</a>
                                            <button className="btn btn-primary" type='button' onClick={onSubmit}>Login</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="card-footer text-center py-3">
                                    <div className="small"><Link to={'/register'}>Need an account? Sign up!</Link></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        <div id="layoutAuthentication_footer">
            <footer className="py-4 bg-light mt-auto">
                <div className="container-fluid px-4">
                    <div className="d-flex align-items-center justify-content-between small">
                        <div className="text-muted">Copyright &copy; Your Website 2021</div>
                        <div>
                            <a href="#">Privacy Policy</a>
                            &middot;
                            <a href="#">Terms &amp; Conditions</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
    )
}

export default Login