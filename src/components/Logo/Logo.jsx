import logo from '@/assets/icons/logo.svg'
import './Logo.scss'

const Logo = (props) => {
  const { loading = 'lazy' } = props

  return (
    <a className="logo" href="/">
      <img
        className="logo__image"
        src={logo}
        alt=""
        width={32}
        height={32}
        loading={loading}
      />
      <span className="logo__text">Mythory</span>
    </a>
  )
}

export default Logo
