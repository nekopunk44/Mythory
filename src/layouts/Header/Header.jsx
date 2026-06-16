import { useState, useRef } from 'react'
import clsx from 'clsx'
import Logo from '@/components/Logo'
import Nav from './components/Nav'
import Icon from '@/components/Icon'
import SearchDropdown from './components/SearchDropdown'
import UserDropdown from './components/UserDropdown'
import BurgerButton from './components/BurgerButton'
import './Header.scss'

const Header = (props) => {
  const {
    className,
    ...rest
  } = props

  const [isAuth, setIsAuth] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchBtnRef = useRef(null)
  const userBtnRef = useRef(null)

  return (
    <header className={clsx('header container', className)} {...rest}>
      <div className="header__inner">
        <Logo loading="eager" />

        <Nav className="header__nav hidden-tablet" />

        <div className="header__actions">
          <button
            ref={searchBtnRef}
            className="header__search-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Icon name="search" size={26} />
          </button>

          <a className="header__create hidden-tablet" href={isAuth ? '/create' : '/login'}>
            Create
          </a>

          {isAuth ? (
            <div className="header__user">
              <button
                ref={userBtnRef}
                className="header__user-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <img
                  className="header__user-avatar"
                  src="/src/assets/default-avatar.png"
                  alt=""
                  width="50"
                  height="50"
                />
                <Icon
                  className="header__user-arrow"
                  name="arrow-right"
                  size={14}
                />
              </button>
              {isUserMenuOpen && (
                <UserDropdown
                  triggerRef={userBtnRef}
                  onClose={() => setIsUserMenuOpen(false)}
                  onLogout={() => {
                    setIsAuth(false)
                    setIsUserMenuOpen(false)
                  }}
                />
              )}
            </div>
          ) : (
            <div className="header__auth hidden-tablet">
              <button
                className="header__auth-btn"
                onClick={() => setIsAuth(true)}
              >
                Log in
              </button>
              <button
                className="header__auth-btn sign-up"
                onClick={() => setIsAuth(true)}
              >
                Sign up
              </button>
            </div>
          )}

          <BurgerButton
            className="visible-tablet"
            isActive={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>
      {isSearchOpen && (
        <SearchDropdown
          triggerRef={searchBtnRef}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
      {isMobileMenuOpen && (
        <div className="header__mobile-menu">
          <Nav className="nav--mobile" />
          <div className="header__mobile-auth">
            <a className="header__create" href={isAuth ? '/create' : '/login'}>
              Create
            </a>
            {isAuth ? (
              <button className="header__auth-btn" onClick={() => setIsAuth(false)}>
                Log out
              </button>
            ) : (
              <>
                <button className="header__auth-btn" onClick={() => setIsAuth(true)}>
                  Log in
                </button>
                <button className="header__auth-btn" onClick={() => setIsAuth(true)}>
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header