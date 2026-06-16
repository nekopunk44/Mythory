import { useState, useRef, useEffect } from 'react'
import './SearchDropdown.scss'

const TABS = [
  { label: 'Genres', value: 'genres' },
  { label: 'Tags', value: 'tags' },
]

const SearchDropdown = (props) => {
  const {
    triggerRef,
    onClose,
  } = props

  const [activeTab, setActiveTab] = useState('genres')
  const [query, setQuery] = useState('')
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    window.location.href = `/search?q=${encodeURIComponent(query)}&type=${activeTab}`
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="search-dropdown" ref={ref}>
      <div className="search-dropdown__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`search-dropdown__tab${activeTab === tab.value ? ' search-dropdown__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <form className="search-dropdown__form" onSubmit={handleSubmit}>
        <div className="search-dropdown__input-wrap">
          <input
            className="search-dropdown__input"
            type="search"
            placeholder="🔍 Search books, stories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <button className="search-dropdown__submit" type="submit">
          Search
        </button>
      </form>
      {/* в будущем: результаты поиска */}
      {/* {query && <div className="search-dropdown__results">...</div>} */}
    </div>
  )
}

export default SearchDropdown