export default function Spinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div
        className="w-100 vh-100 bg-white position-fixed translate-middle top-50 start-50 d-flex align-items-center justify-content-center"
        style={{ zIndex: 9999 }}
      >
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="spinner-wrapper">
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}
