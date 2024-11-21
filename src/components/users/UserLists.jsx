import React, { useEffect, useState } from 'react'
import requestApi from '../../helpers/api'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import DataTableUser from '../common/DataTableUser'

const UserLists = () => {
    const [users,setUsers] = useState([])
    const dispatch = useDispatch()
    const [numOfPage,setNumOfPage] = useState(1)
    const [currentPage,setCurrentPage] = useState(1)
    const [itemsPerPage,setItemPerPage] = useState(1)
    const [searchString,setSearchString] = useState('')

    const [selected, setSelected] = useState([])
    const [deleteItem, setDeleted] = useState(null)
    const [deleteType, setDeleteType] = useState('single')

    const [showPopup,setShowPopup] = useState(false)

    const [refreshData, setRefreshData] = useState(Date.now())

    useEffect(() => {
        dispatch(actions.controlLoading(true))
        const query = `?items_per_page=${itemsPerPage}&page=${currentPage}&search=${searchString}`
        requestApi(`user/get-all-user${query}`, 'GET', [])
        .then(response => {
            console.log(response)
            setUsers(response.data.data)
            setCurrentPage(response.data.currentPage)
            setNumOfPage(response.data.lastPage)
            dispatch(actions.controlLoading(false))
        })
        .catch(err => {
            console.log(err)
            dispatch(actions.controlLoading(false))
        })
    },[currentPage,itemsPerPage,searchString, refreshData])

    const onClickCheckBox = (e) => {
        let checked = e.target.checked;
        let value = e.target.value;
        if( checked ) {
            if (!selected.includes(Number(value))) {
                setSelected([...selected,Number(value)])
            }
        } else {
            let index = selected.indexOf(Number(value))
            const temp = [...selected];
            temp.splice(index,1)
            setSelected(temp)
        }
    }

    const onSelectAll = (e) => {
        if(e.target.checked) {
            const temp = users.map(user => user.id)
            setSelected(temp)
        } else {
            setSelected([])
        }
    } 

    const hanldeDeleteMultiple = () => {
        console.log('multi delete', selected)
        setDeleteType('multi')
        setShowPopup(!showPopup)
    }

    const handleDelete = (id) => {
        console.log(id)
        setShowPopup(!showPopup)
        setDeleteType('single')
        setDeleted(id)
    }

    const handleDeleteApi = () => {
        if(deleteType == 'single') {
            dispatch(actions.controlLoading(true))
            requestApi(`user/${deleteItem}`,'DELETE',[])
            .then(res => {
                dispatch(actions.controlLoading(false))
                console.log(res)
                setShowPopup(false)
                setRefreshData(Date.now())
            })
            .catch(err => {
                console.log(err)
                dispatch(actions.controlLoading(false))
                setShowPopup(false)
            })
        } else {
            dispatch(actions.controlLoading(true))
            requestApi(`user/multiple?ids=${selected.toString()}`,'DELETE',[])
            .then(res => {
                setShowPopup(false)
                dispatch(actions.controlLoading(false))
                setSelected([])
                console.log(res)
            })
            .catch(err => {
                console.log(err)
                dispatch(actions.controlLoading(false))
                setShowPopup(false)
            })
        }
    }

    return (
        <div id="layoutSidenav_content">
            <main>
                <div className='container-fluid px-4'>
                    <h1 className='mt-4'>Tables</h1>
                    <ol className='breadcrumb mb-4'>
                        <li className='breadcrumb-item'><Link to="/">Dashboard</Link></li>
                        <li className='breadcrumb-item active'>Tables</li>
                    </ol>
                    <div className='mb-3'>
                        <Link to="/user/add" className='btn btn-sm btn-success me-2'><i className='fa fa-plus'></i>Add new</Link>
                        {selected.length > 0 ? (
                            <button type='button' className='btn btn-sm btn-danger me-2' onClick={hanldeDeleteMultiple}><i className='fa fa-trash'></i> Delete Multiple</button>
                        ) : '' }
                    </div>
                    <DataTableUser 
                        data={users}
                        numOfPage={numOfPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onChangeItemsPerPage={setItemPerPage}
                        onSearchString={setSearchString}
                        handleDelete={handleDelete}
                        onClickCheckBox={onClickCheckBox}
                        onSelectAll={onSelectAll}
                        selected={selected}
                    />
                </div>
            </main>
            <Modal show={showPopup} onHide={() => setShowPopup(false)} size='sm'>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn chắc chắn xóa!</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setShowPopup(false)}>Close</Button>
                        <Button className='btn btn-danger' onClick={handleDeleteApi}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UserLists