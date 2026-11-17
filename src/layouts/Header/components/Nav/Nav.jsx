import clsx from 'clsx'
import './Nav.scss'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Genres', href: '/genres' },
  { label: 'Community', href: '/community' },
]

const Nav = (props) => {
  const { className, ...rest } = props

  const currentPath = window.location.pathname

  return (
    <nav className={clsx('nav', className)} {...rest}>
      <ul className="nav__list">
        {NAV_ITEMS.map((item) => (
          <li className="nav__item" key={item.href}>
            <a
              className={clsx(
                'nav__link',
                currentPath === item.href && 'nav__link--active',
              )}
              href={item.href}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
