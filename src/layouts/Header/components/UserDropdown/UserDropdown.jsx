import { useEffect, useRef } from 'react'
import './UserDropdown.scss'

const UserDropdown = (props) => {
  const {
    triggerRef,
    onClose,
    onLogout,
  } = props

  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose, triggerRef])

  return (
    <div className="user-dropdown" ref={ref}>
      <a className="user-dropdown__item" href="/profile">
        My profile
      </a>
      <button className="user-dropdown__item" onClick={onLogout}>
        Log out
      </button>
    </div>
  )
}

export default UserDropdown