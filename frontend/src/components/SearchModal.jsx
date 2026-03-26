import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchModal({ show, onClose }) {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/shop?search=${encodeURIComponent(keyword.trim())}`)
      setKeyword('')
      onClose()
    }
  }

  if (!show) return null

  return (
    <div
      className="modal d-flex align-items-start justify-content-center"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, position: 'fixed', inset: 0 }}
    >
      <div className="modal-dialog modal-fullscreen m-0 w-100">
        <div className="modal-content rounded-0">
          <div className="modal-header">
            <h5 className="modal-title">Search by keyword</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body d-flex align-items-center">
            <form className="input-group w-75 mx-auto d-flex" onSubmit={handleSearch}>
              <input
                type="search"
                className="form-control p-3"
                placeholder="Search products..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                autoFocus
              />
              <button type="submit" className="input-group-text p-3">
                <i className="fa fa-search"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
