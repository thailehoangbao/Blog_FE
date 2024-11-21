import React, { useEffect, useState } from 'react'
import requestApi from '../helpers/api'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'

const Dashboard = () => {
    const dispatch = useDispatch()
    const [listUser,setListUser] = useState({})
    const [listPost,setListPost] = useState({})

    useEffect(() => {
        const promiseUser = requestApi(`user/get-all-user`,'GET')
        const promisePost = requestApi(`posts`,'GET')
        dispatch(actions.controlLoading(true))
        Promise.all([promisePost,promiseUser])
        .then(res => {
            console.log(res)
            dispatch(actions.controlLoading(false))
            setListUser({
                ...listUser, totalUser: res[1].data.total
            })
            setListPost({
                ...listPost, totalPost: res[0].data.total
            })
        })
        .catch(error => {
            console.log(error)
            dispatch(actions.controlLoading(false))
        })
    },[])
    return (
    <div id="layoutSidenav_content">
        <main>
            <div className="container-fluid px-4">
                <h1 className="mt-4">Dashboard</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Dashboard</li>
                </ol>
                <div className="row">
                    <div className="col-xl-3 col-md-6">
                        <div className="card bg-primary text-white mb-4">
                            <div className="card-body">Total Users
                            {listUser.totalUser && (
                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                                    {listUser.totalUser}
                                </span>
                            )}
                            </div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to="/users">Users List</Link>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card bg-warning text-white mb-4">
                            <div className="card-body">Total Post
                            {listPost.totalPost && (
                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                                    {listPost.totalPost}
                                </span>
                            )}
                            </div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <Link className="small text-white stretched-link" to="/posts">View Details</Link>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-xl-3 col-md-6">
                        <div className="card bg-success text-white mb-4">
                            <div className="card-body">Success Card</div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <a className="small text-white stretched-link" href="#">View Details</a>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card bg-danger text-white mb-4">
                            <div className="card-body">Danger Card</div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <a className="small text-white stretched-link" href="#">View Details</a>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </main>
        <Modal show={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn chắc chắn xóa!</Modal.Body>
                    <Modal.Footer>
                        <Button>Close</Button>
                        <Button className='btn btn-danger'>Delete</Button>
                </Modal.Footer>
        </Modal>                  
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
    )
}

export default Dashboard