import Logo from '@/components/Logo'
import './Footer.scss'

const INFO_LINKS = [
  { label: 'Our Mission', href: '/mission' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Publish a book', href: '/publish' },
  { label: 'Recommendations', href: '/recommendations' },
  { label: 'Rules for authors', href: '/rules' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'User agreement', href: '/agreement' },
  { label: 'Copyright', href: '/copyright' },
]

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Genres', href: '/genres' },
  { label: 'Community', href: '/community' },
  { label: 'Log in', href: '/login' },
  { label: 'Sign up', href: '/signup' },
]

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <Logo />

        <div className="footer__markup">
          <nav className="footer__info">
            {INFO_LINKS.map((link) => (
              <a className="footer__link" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <nav className="footer__nav">
            {NAV_LINKS.map((link) => (
              <a className="footer__link" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="footer__copy">&copy; 2026 MomentumX</p>
      </div>
    </footer>
  )
}

export default Footer
