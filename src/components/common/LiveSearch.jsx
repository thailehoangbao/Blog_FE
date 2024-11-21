import React, { useEffect, useState } from 'react'

const LiveSearch = ({onSearchString}) => {
    const [keyword, setKeyword] = useState('')
    //debounce
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            console.log('call func on keysearch')
            onSearchString(keyword)
        }, 1000);

        return () => clearTimeout(delayDebounce)
    },[keyword])

    const onTyping = (e) => {
        setKeyword(e.target.value)
    }
    return (
        <div className='col-sm-12 col-md-6 mb-4'>
            <label className='d-inline-flex float-end'>
                Search:
                <input type="search" value={keyword} onChange={onTyping} className='form-control form-control-sm ms-1' placeholder='Email or Name' />
            </label>
        </div>
    )
}

export default LiveSearch