import React from 'react'
import { formatDate, formatDateTime } from '../../helpers/helpers'
import LiveSearch from './LiveSearch'
import { Link } from 'react-router-dom'

const DataTablePost = ({data,currentPage,numOfPage,onPageChange,onChangeItemsPerPage,onSearchString,handleDelete, onClickCheckBox, onSelectAll, selected}) => {
    const renderPagination = () => {
        const pagination = []
        const nextPage = currentPage + 1 > numOfPage ? null : currentPage + 1 
        const prevPage = currentPage - 1 < 1 ? null : currentPage - 1
        pagination.push(
            <li key="prev" className={prevPage ? 'page-item' : 'page-item disabled'} >
                <button className='page-link' onClick={() => onPageChange(currentPage - 1)}>&laquo;</button>
            </li>
        )

        for(let i = 1; i <= numOfPage; i++) {
            pagination.push(
                <li key={i} className={currentPage === i ? "page-item active" : "page-item"}>
                    <button className='page-link' onClick={() => {
                        onPageChange(i)
                    }}>{i}</button>
                </li>
            )
        }

        pagination.push(
            <li key="next" className={nextPage ? 'page-item' : 'page-item disabled'}>
                <button className='page-link' onClick={() => onPageChange(currentPage + 1)}>&raquo;</button>
            </li>
        )

        return pagination;
    }

    const onChangeOption = (e) => {
        onChangeItemsPerPage(e.target.value)
    }
    return (
        <div className="card-body">
        <div className='row mb-3 '>
            <div className='col-sm-12 col-md-6'>
                <label className='d-inline-flex'>show
                    <select name="example_lenght" className='form-select form-select-sm ms-1 me-1' onChange={onChangeOption}>
                        <option value="1" >1</option>
                        <option value="2" >2</option>
                        <option value="3" >3</option>
                        <option value="5" >5</option>
                        <option value="10" >10</option>
                    </select> entries
                </label>
            </div>
            {<LiveSearch onSearchString={onSearchString}/>}
            <table id="datatablesSimple" className='table table-striped table-bordered' cellSpacing='0' width="100%">
                    <thead>
                        <tr>
                            <td><input type="checkbox" checked={selected.length == data.length ? true : false } className='form-check-input' onChange={onSelectAll}/></td>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Thumbnail</th>
                            <th>Status</th>
                            <th>Created_at</th>
                            <th>Updated_at</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Thumbnail</th>
                            <th>Status</th>
                            <th>Created_at</th>
                            <th>Updated_at</th>
                            <th>Action</th>
                        </tr>
                    </tfoot>
                    <tbody>
                        {data.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td><input type="checkbox" className='form-check-input' checked={selected.includes(item.id)} value={item.id} onChange={onClickCheckBox}/></td>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <img src={`${import.meta.env.VITE_API_URL}/${item.thumbnail}`} alt="..." width={50} height={50} />
                                    </td>
                                    <td>{item.status == '1' ? <i className="bi bi-check" style={{ color: 'green', fontSize:'30px' }} ></i> : <i className="bi bi-x" style={{ color: 'red', fontSize:'30px' }}></i>}</td>
                                    <td>{formatDateTime(item.created_at)}</td>
                                    <td>{formatDateTime(item.updated_at)}</td>
                                    <td>
                                        <button className='btn btn-danger btn-sm m-2' onClick={() => handleDelete(item.id)}>DELETE</button>
                                        <Link className='btn btn-warning btn-sm m-2' to={`/posts/edit/${item.id}`}>EDIT</Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
            </table> 
            {numOfPage > 1 && (
                <nav aria-label="Page navigation example ">
                    <ul className="pagination d-flex justify-content-center">
                        {renderPagination()}
                    </ul>
                </nav>
            )}
        </div>
    </div> 
    )
}

export default DataTablePost